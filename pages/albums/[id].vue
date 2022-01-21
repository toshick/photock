<template>
  <main class="pb-30">
    <GlobalHeader>
      <o-upload @input="onSelectFiles" multiple>
        <o-button tag="a" variant="primary" size="small" class="mr-3">
          <span
            ><i class="mr-2 fas fa-arrow-alt-circle-up"></i>イメージ追加</span
          >
        </o-button>
      </o-upload>
      <o-button
        class="mr-3"
        size="small"
        variant="primary"
        @click="resetting = true"
        >リセット</o-button
      >
      <o-button size="small" variant="primary" @click="deleting = true"
        ><i class="mr-2 fas fa-skull-crossbones"></i>アルバム削除</o-button
      >
    </GlobalHeader>

    <section class="container pt-5 pb-20 flex">
      <!-- albumId -->
      <div class="pb-4 text-lg">
        <FormInput
          name="albumId"
          label="アルバムID"
          placeholder="アルバムID"
          class=""
          size="small"
          :yup="$vali.yup(yup.string())"
          :val="form.albumId"
          @input="(val:string) => (form.albumId = val)"
        >
          <template #right>
            <o-button
              tag="a"
              variant="primary"
              size="small"
              class="mx-3"
              @click="saveAlbumId"
              :disabled="!albumIdEditted"
            >
              <span>保存</span>
            </o-button>
          </template>
        </FormInput>
      </div>
      <!-- description -->
      <div class="albumDescription ml-4">
        <FormInput
          textarea
          label="アルバム説明"
          name="albumDescription"
          placeholder="アルバム説明"
          class="w-screen-md"
          size="small"
          :yup="$vali.yup(yup.string())"
          :val="form.albumDescription"
          expanded
          @input="(val:string) => (form.albumDescription = val)"
        >
          <template #right>
            <o-button
              tag="a"
              variant="primary"
              size="small"
              class="mx-3"
              @click="saveDescription"
              :disabled="!albumDescriptionEditted"
            >
              <span>保存</span>
            </o-button>
          </template>
        </FormInput>
        <!-- Saved -->
        <transition name="fade">
          <div v-if="savedDescription" class="albumDescription-saved">
            <span>
              <i class="fas fa-check"></i>
              Saved</span
            >
          </div>
        </transition>
      </div>
    </section>
    <!-- イメージ一覧 -->
    <section class="container">
      <draggable
        tag="ul"
        class="imglist"
        :list="dragList"
        handle=".handle"
        item-key="id"
        @change="onChangeSort"
      >
        <template #item="{ element, index }">
          <li class="imglist-item">
            <!-- <i class="fa fa-align-justify handle"></i> -->

            <AlbumItem
              :ref="setAlbumRef"
              :index="index"
              :item="element"
              @remove="removeItem"
              @save="saveItem"
              :saved="
                itemReactiveData[element.id] &&
                itemReactiveData[element.id].saved
              "
              @move-top="() => moveTop(index)"
              @move-bottom="() => moveBottom(index)"
              @checked="(checked) => itemChecked(checked, element.id)"
            />
          </li>
        </template>
      </draggable>
    </section>
    <!-- リセット確認 -->
    <Overlay :active="resetting">
      <div class="text-lg text-center">
        <a class="text-red-500 px-4" @click="reset"
          ><i class="fas fa-exclamation-triangle pr-2"></i>アルバム "{{
            albumId
          }}" をリセット</a
        >
        <a class="text-gray-500 px-4" @click="resetting = false">キャンセル</a>
      </div>
      <template #description>
        <div class="text-center mt-12 text-sm">
          このアルバムの全てのデータをリセットします
        </div>
      </template>
    </Overlay>
    <!-- 削除確認 -->
    <Overlay :active="deleting">
      <div class="text-lg text-center">
        <a class="text-red-500 px-4" @click="del"
          ><i class="fas fa-exclamation-triangle px-2"></i>アルバム "{{
            albumId
          }}" を削除</a
        >
        <a class="text-gray-500 px-4" @click="deleting = false">キャンセル</a>
      </div>
      <template #description>
        <div class="text-center mt-12 text-sm">
          このアルバムを削除してトップへ戻ります
        </div>
      </template>
    </Overlay>

    <!-- 移動 -->
    <div class="moveItem" :class="moveItemClass">
      <p class="px-2">選択した {{ selectedItems.length }} 個を</p>
      <FormInput
        name="moveItem"
        placeholder="移動先番号"
        size="small"
        :yup="yup.number().typeError('数字を入力してください')"
        :val="form.moveIndex"
        @input="(val:string) => (form.moveIndex = val)"
        :top-message="true"
        :hide-error-message="true"
      >
        <template v-slot:right="{ meta, val }" class="xxx">
          <p class="px-2">の直後に</p>
          <o-button
            tag="a"
            variant="primary"
            size="small"
            class=""
            @click="bulkMove"
            :disabled="!meta.valid"
          >
            <span>まとめて移動</span>
          </o-button>
          <o-button tag="a" size="small" class="ml-5" @click="clearChecked">
            <span><i class="fas fa-times mr-2"></i>選択解除</span>
          </o-button>
        </template>
      </FormInput>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import * as yup from 'yup';
import draggable from 'vuedraggable';
import type { Album, AlbumItem as Item } from '@/types/apptype';
import { createToast, asort, zeropad } from '@/util/helper';
import AlbumItem from '@/components/album/AlbumItem.vue';

type AlbumItemComponent = InstanceType<typeof AlbumItem>;
type ItemReactiveData = {
  saved: boolean;
  checked: boolean;
  index: number;
};
const router = useRouter();

const oruga = inject('oruga');
const toast = createToast(oruga);
const r = useRoute();
const albumId = r.params.id as string;
const { albumData, refresh } = await useAlbumDetail(albumId);

// console.log('albumData', JSON.stringify(albumData.value.items));

const dragList = ref([]);
const savedDescription = ref(false);
const resetting = ref(false);
const deleting = ref(false);
const itemReactiveData = reactive<{ [key: string]: ItemReactiveData }>({});
const form = reactive({
  albumId,
  albumDescription: albumData.value.albumDescription || '',
  moveIndex: '',
});
const albumIdEditted = computed(() => {
  return form.albumId !== albumId;
});
const albumDescriptionEditted = computed(() => {
  return form.albumDescription !== albumData.value.albumDescription;
});

const selectedItems = computed(() => {
  return Object.keys(itemReactiveData).filter((id) => {
    return itemReactiveData[id].checked;
  });
});

const showMoveItem = computed(() => selectedItems.value.length > 0);
const moveItemClass = computed(() => {
  const ret: { [key: string]: boolean } = {};
  if (showMoveItem.value) {
    ret['-show'] = true;
  }
  return ret;
});

watchEffect(() => {
  albumData.value.items.forEach((i: Item) => {
    console.log('i', { ...i });

    if (!itemReactiveData[i.id]) {
      itemReactiveData[i.id] = {
        saved: false,
        checked: false,
        index: typeof i.index === 'string' ? +i.index : null,
      };
    }
  });
  dragList.value = asort([...albumData.value.items], 'index');
});

const albumRefs = ref<AlbumItemComponent[]>([]);
const setAlbumRef = (a: AlbumItemComponent) => {
  if (a) {
    albumRefs.value.push(a);
  }
};

/**
 * onSelectFiles
 */
const onSelectFiles = async (e: InputEvent) => {
  const filelist: FileList = (e.target as HTMLInputElement).files;
  const files = Array.from(filelist);
  // upload imgs
  const reslist = await Promise.all(
    files.map((f, index) => {
      return saveAlbumImage(albumId, f, index);
    }),
  );
  const ok = reslist.every((res) => res.imgSaved === true);
  if (!ok) {
    toast.ng('アップロードに失敗したケロ');
  }

  await refresh();

  const items = (dragList.value || []).map((i, index) => {
    return { ...i, index: zeropad(index, 5) };
  });
  const res = await save({ items });
  if (res.error) {
    toast.ng('アップロード後アルバム保存に失敗したケロ');
    return res.error;
  }
  toast.ok('アップロードしたケロ');
};

/**
 * save
 */
const save = async (params: Partial<Album>) => {
  if (!params) {
    return { error: 'no params on save' };
  }
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    ...params,
  });
  if (res.error) {
    return res.error;
  }
  return res;
};

/**
 * saveDescription
 */
const saveDescription = async () => {
  const res = await save({ albumDescription: form.albumDescription });
  if (res.error) {
    toast.ng(`❗️説明保存エラー ${res.error}`);
    return;
  }
  await refresh();
  savedDescription.value = true;
  setTimeout(() => {
    savedDescription.value = false;
  }, 1000);
};

/**
 * saveAlbumId
 */
const saveAlbumId = async () => {
  const res = await changeAlbumId(albumId, form.albumId);
  if (res.error) {
    toast.ng(`❗️アルバムID変更エラー ${res.error}`);
    return;
  }
  console.log('changeAlbumId', JSON.stringify(res.data));
  router.push(`/albums/${form.albumId}`);
};

/**
 * removeItem
 */
const removeItem = async (item: Item) => {
  const res = await removeAlbumImage(albumId, item.id);
  if (res.error) {
    toast.ng(`❗️画像削除エラー ${res.error}`);
    return;
  }
  await refresh();
  toast.ok('削除したケロ');
};

/**
 * saveItem
 */
const saveItem = async (item: Item) => {
  const items = albumData.value.items.map((i) => {
    if (i.id === item.id) return item;
    return i;
  });
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    items,
  });
  if (res.error) {
    toast.ng(`❗️アイテム情報保存エラー ${res.error}`);
    return;
  }
  await refresh();
  itemReactiveData[item.id].saved = true;
  setTimeout(() => {
    itemReactiveData[item.id].saved = false;
  }, 1000);
};

/**
 * reset
 */
const reset = async () => {
  resetting.value = false;
  const res = await resetAlbumImage(albumId);
  if (res.error) {
    toast.ng(`❗️リセットエラー ${res.error}`);
    return;
  }
  await refresh();
  toast.ok(`アルバム ${albumId} をリセットしたケロ`);
};

/**
 * del
 */
const del = async () => {
  resetting.value = false;
  const res = await deleteAlbum(albumId);
  if (res.error) {
    toast.ng(`❗️アルバム削除エラー ${res.error}`);
    return;
  }
  toast.ok(`アルバム ${albumId} を削除したケロ`);
  router.push('/');
};

/**
 * reload
 */
const reload = async () => {
  await refresh();
  toast.ok('リセットしたケロ');
};

/**
 * onChangeSort
 */
const onChangeSort = async () => {
  const items = (dragList.value || []).map((i, index) => {
    return { ...i, index: zeropad(index, 5) };
  });
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    items,
  });
  if (res.error) {
    toast.ng(`❗️ソート保存エラー ${res.error}`);
    return;
  }
  await refresh();
  // toast.ok('順番変えたケロ');
};

const moveTop = async (index: number) => {
  if (index === 0) return;
  const ary = [...dragList.value];
  const item = ary[index];
  ary.splice(index, 1);
  ary.unshift(item);
  dragList.value = ary;
  await onChangeSort();
};

const moveBottom = async (index: number) => {
  const ary = [...dragList.value];
  if (index === ary.length - 1) return;
  const item = ary[index];
  ary.splice(index, 1);
  ary.push(item);
  dragList.value = ary;
  await onChangeSort();
};

const itemChecked = async (checked: boolean, id: string) => {
  itemReactiveData[id].checked = checked;
};

const clearChecked = () => {
  albumRefs.value.forEach((myref: AlbumItemComponent) => {
    myref.resetChecked();
  });
};

type RemoveItem = { item: Item; remove: boolean };

/**
 * 1. オリジナル配列にremoveフラグを付与した配列を作成
 * 2. 後で削除するための印として移動アイテムと同一オブジェクトにremove: trueをセット
 * 3. 指定箇所に移動アイテムを重複した状態で追加（removeはfalse）
 * 4. 最後にremove: trueのアイテムを除外してオリジナル配列にもどしたものをセット
 */
const bulkMove = () => {
  const moveIndex = +form.moveIndex + 1;
  const ary = [...dragList.value].map((i: Item) => {
    return { item: i, remove: false };
  });
  if (moveIndex > ary.length) {
    return;
  }

  const items = selectedItems.value
    .map((id: string) => {
      return dragList.value.find((i: Item) => {
        return i.id === id;
      });
    })
    .filter((data) => data)
    .map((data) => {
      return { item: data, remove: false };
    });

  items.forEach((i: RemoveItem) => {
    const find = ary.find((a) => {
      return a.item.id === i.item.id;
    });
    if (find) {
      find.remove = true;
    }
  });

  ary.splice(moveIndex, 0, ...items);
  dragList.value = ary
    .filter((a) => {
      return !a.remove;
    })
    .map((a) => {
      return a.item;
    });

  // 選択解除
  clearChecked();
};

//----------------------
// use
//----------------------
</script>

<style scoped lang="scss">
.albumDescription {
  display: inline-block;
  position: relative;
  .field {
    margin: 0;
  }
}
.albumDescription-saved {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: rgba(white, 0.95);
  span {
    color: var(--primary-color);
    font-size: 30px;
    font-weight: bold;
  }
}
.imglist {
  display: flex;
  flex-wrap: wrap;
}
.imglist-item {
  margin: 0px 16px 30px 0;
}
</style>

<style lang="scss">
.moveItem {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff7f6;
  padding: 20px 30px 20px;
  box-shadow: 0 0 2px 1px rgba(black, 0.13);
  width: 100%;

  position: fixed;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;

  transition: all 0.3s ease;
  &.-show {
    bottom: 0;
  }
  .field.has-addons {
    display: flex;
    align-items: center;
    justify-content: center;
    & > .control {
      width: 90px;
    }
  }
}
</style>
