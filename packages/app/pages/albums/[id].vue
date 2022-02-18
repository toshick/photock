<template>
  <article class="pb-30">
    <GlobalHeader>
      <template #left>
        <o-button
          tag="a"
          variant="success"
          size=""
          class="btn-saveIndex"
          :class="saveIndexBtnClass"
          @click="startSaveSortIndex"
        >
          <span><i class="mr-2 fas fa-arrow-up"></i>並び替えを保存</span>
        </o-button>
      </template>
      <o-button
        class="mr-3"
        size="small"
        variant="primary"
        @click="uploadingAlbum = true"
        :disabled="!hasFirebaseSetting"
        ><i class="mr-2 fas fa-arrow-alt-circle-up"></i
        >FireStorageにアップロード</o-button
      >
      <o-upload @input="onUploadFiles" multiple>
        <o-button tag="a" variant="primary" size="small" class="mr-3">
          <span
            ><i class="mr-2 fas fa-arrow-alt-circle-up"></i>イメージ追加</span
          >
        </o-button>
      </o-upload>
      <o-button size="small" variant="primary" @click="deletingAlbum = true"
        ><i class="mr-2 fas fa-skull-crossbones"></i>アルバム削除</o-button
      >
      <o-button
        class="ml-3"
        size="small"
        variant="primary"
        @click="startExportAlbum"
        ><i class="mr-2 fas fa-arrow-circle-down"></i>エクスポート</o-button
      >
    </GlobalHeader>
    <div class="flex pt-70px">
      <aside class="w-400px px-8 relative">
        <div class="sticky top-70px">
          <div class="">
            <Stack :space="5">
              <!-- albumId -->
              <div class="text-lg">
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
                      <span>変更</span>
                    </o-button>
                  </template>
                </FormInput>
              </div>
              <!-- albumTitle -->
              <div class="text-lg">
                <FormInput
                  name="albumTitle"
                  label="アルバムタイトル"
                  placeholder="アルバムタイトル"
                  class=""
                  size="small"
                  expanded
                  :yup="$vali.yup(yup.string())"
                  :val="form.albumTitle"
                  @input="(val:string) => (form.albumTitle = val)"
                >
                  <template #right>
                    <o-button
                      tag="a"
                      variant="primary"
                      size="small"
                      class="mx-3"
                      @click="saveTitle"
                      :disabled="!albumTitleEditted"
                    >
                      <span>変更</span>
                    </o-button>
                  </template>
                </FormInput>
                <p class="text-green-500">
                  <transition name="fade">
                    <span v-if="savedTitle" class="block">
                      <i class="fas fa-check"></i>
                      Saved</span
                    >
                  </transition>
                </p>
              </div>
              <!-- description -->
              <div class="albumDescription">
                <FormInput
                  textarea
                  expanded
                  label="アルバム説明"
                  name="albumDescription"
                  placeholder="アルバム説明"
                  size="small"
                  :height="40"
                  :yup="$vali.yup(yup.string())"
                  :val="form.albumDescription"
                  @input="(val:string) => (form.albumDescription = val)"
                >
                </FormInput>
                <div class="mt-3 text-right flex">
                  <p class="text-green-500">
                    <transition name="fade">
                      <span v-if="savedDescription" class="block">
                        <i class="fas fa-check"></i>
                        Saved</span
                      >
                    </transition>
                  </p>
                  <o-button
                    tag="a"
                    variant="primary"
                    size="small"
                    class="ml-auto"
                    @click="saveDescription"
                    :disabled="!albumDescriptionEditted"
                  >
                    <span>保存</span>
                  </o-button>
                </div>
              </div>
              <!-- まとめ -->
              <div class="albumConclusion">
                <FormInput
                  textarea
                  expanded
                  label="アルバムまとめ"
                  name="albumConclusion"
                  placeholder="アルバムまとめ"
                  size="small"
                  :height="60"
                  :yup="$vali.yup(yup.string())"
                  :val="form.albumConclusion"
                  @input="(val:string) => (form.albumConclusion = val)"
                >
                </FormInput>
                <div class="mt-3 text-right flex">
                  <p class="text-green-500">
                    <transition name="fade">
                      <span v-if="savedConclusion" class="block">
                        <i class="fas fa-check"></i>
                        Saved</span
                      >
                    </transition>
                  </p>
                  <o-button
                    tag="a"
                    variant="primary"
                    size="small"
                    class="ml-auto"
                    @click="saveConclusion"
                    :disabled="!albumConclusionEditted"
                  >
                    <span>保存</span>
                  </o-button>
                </div>
              </div>
            </Stack>
          </div>
        </div>
      </aside>
      <main class="flex-1 flex-grow-auto flex-shrink-0">
        <!-- NO ITEMS -->
        <p
          v-if="itemList.length === 0"
          class="pt-4 text-3xl font-bold text-gray-400"
        >
          NO ITEMS
        </p>
        <!-- イメージ一覧 -->
        <section v-else class="py-2">
          <div class="mb-4">
            <a @click="checkAllToggle" class="link-action">
              <i class="fas fa-check"></i>
              Check All
            </a>
          </div>

          <draggable
            tag="ul"
            class="imglist"
            :list="dragList"
            handle=".handle"
            item-key="id"
            @sort="onSortItem"
          >
            <template #item="{ element, index }">
              <li class="imglist-item">
                <AlbumItem
                  :ref="setAlbumRef"
                  :id="element.id"
                  :index="index"
                  :item="element"
                  :saved="element.saved"
                  @save="saveItem"
                  @move-up="() => moveUp(index)"
                  @move-down="() => moveDown(index)"
                  @checked="(checked) => (element.checked = checked)"
                />
              </li>
            </template>
          </draggable>
        </section>
      </main>
    </div>

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
    <!-- アルバム削除確認 -->
    <Overlay :active="deletingAlbum">
      <div class="text-lg text-center">
        <a class="text-red-500 px-4" @click="del"
          ><i class="fas fa-exclamation-triangle px-2"></i>アルバム "{{
            albumId
          }}" を削除</a
        >
        <a class="text-gray-500 px-4" @click="deletingAlbum = false"
          >キャンセル</a
        >
      </div>
      <template #description>
        <div class="text-center mt-12 text-sm">
          このアルバムを削除してトップへ戻ります
        </div>
      </template>
    </Overlay>
    <!-- 削除確認 -->
    <Overlay :active="deleting">
      <div class="text-lg text-center">
        <a class="text-red-500 px-4" @click="startSaveSelectedState"
          ><i class="fas fa-exclamation-triangle px-2"></i>選択ファイル
          {{ selectedItems.length }}個 を削除</a
        >
        <a class="text-gray-500 px-4" @click="deleting = false">キャンセル</a>
      </div>
    </Overlay>
    <!-- アップロード確認 -->
    <Overlay :active="uploadingAlbum">
      <div class="text-lg text-center">
        <a class="text-red-500 px-4" @click="startUploadingFireStorage"
          ><i class="fas fa-exclamation-triangle px-2"></i
          >エクスポートしてからFireStoreにまとめてアップロードします</a
        >
        <a class="text-gray-500 px-4" @click="uploadingAlbum = false"
          >キャンセル</a
        >
      </div>
    </Overlay>
    <!-- Firebaseアップロード状況 -->
    <Overlay :active="uploadingFireBase.doing">
      <div class="text-lg text-center">
        <p class="text-red-500 px-4">
          <i class="fas fa-exclamation-triangle px-2"></i
          >Firebaseへアップロード中
        </p>
        <p class="pt-4">
          {{ uploadingFireBase.count }}/{{ uploadingFireBase.total }}
        </p>
      </div>
    </Overlay>

    <!-- 移動 -->
    <div class="bottomUI -moveItem" :class="moveItemClass">
      <a class="link-action mr-8" @click="clearChecked">
        <span><i class="fas fa-times mr-2"></i>選択解除</span>
      </a>
      <p class="pr-3">選択した {{ selectedItems.length }} 個を</p>

      <o-button tag="a" variant="primary" size="small" @click="deleting = true">
        <span class="">まとめて削除</span>
      </o-button>
      <p class="mx-3">または</p>
      <o-select
        placeholder="移動先番号"
        size="small"
        @input="onSelectMoveIndex"
        v-if="selectedItems.length > 0"
      >
        <option
          :value="index"
          v-for="(_, index) in dragList"
          :key="`index-${index}`"
        >
          {{ index }}
        </option>
      </o-select>
      <o-button
        tag="a"
        variant="primary"
        size="small"
        class="ml-2"
        @click="bulkMove"
        :disabled="form.moveIndex === ''"
      >
        <span class="">の直後にまとめて移動</span>
      </o-button>
    </div>
  </article>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import draggable from 'vuedraggable';
import type { AlbumItem as Item, AlbumItemEdit } from '@/types/apptype';
import {
  createToast,
  createLoadingOverlay,
  asort,
  zeropad,
  sleep,
} from '@/util/helper';
import AlbumItem from '@/components/album/AlbumItem.vue';

type AlbumItemComponent = InstanceType<typeof AlbumItem>;

const router = useRouter();
const oruga = inject('oruga');
const toast = createToast(oruga);
const loadingOverlay = createLoadingOverlay();
const r = useRoute();
const albumId = r.params.id as string;
const { albumData, refresh } = await useAlbumDetail(albumId);
const setting = await fetchSetting();

// console.log('albumData', JSON.stringify(Object.keys(albumData.value)));
console.log('setting', setting);

const hasFirebaseSetting = ref(setting.firebase || false);
const itemList = ref([]);
let itemListBk = [];
const dragList = ref([]);
const savedTitle = ref(false);
const savedDescription = ref(false);
const savedConclusion = ref(false);
const resetting = ref(false);
const deletingAlbum = ref(false);
const uploadingAlbum = ref(false);
const uploadingFireBase = reactive({
  doing: false,
  count: 0,
  total: 0,
});
const deleting = ref(false);
const form = reactive({
  albumId,
  albumDescription: albumData.value.albumDescription || '',
  albumConclusion: albumData.value.albumConclusion || '',
  albumTitle: albumData.value.albumTitle || '',
  moveIndex: '',
});
const albumIdEditted = computed(() => {
  return form.albumId !== albumId;
});
const albumTitleEditted = computed(() => {
  return form.albumTitle !== albumData.value.albumTitle;
});
const albumDescriptionEditted = computed(() => {
  return form.albumDescription !== albumData.value.albumDescription;
});
const albumConclusionEditted = computed(() => {
  return form.albumConclusion !== albumData.value.albumConclusion;
});

const selectedItems = computed(() => {
  return itemList.value.filter((i: AlbumItemEdit) => {
    return i.checked;
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
  itemList.value = albumData.value.items;
  itemListBk = [...albumData.value.items];
});

watchEffect(() => {
  dragList.value = asort([...itemList.value], 'index').filter(
    (i: AlbumItemEdit) => !!i.remove === false,
  );
});

const albumRefs = ref<AlbumItemComponent[]>([]);
const setAlbumRef = (a: AlbumItemComponent) => {
  if (a) {
    const find = albumRefs.value.find((ref) => ref.$props.id === a.$props.id);
    if (!find) {
      albumRefs.value.push(a);
    }
  }
};

const checkAllToggle = (e) => {
  const checkedAll = itemList.value.every((i: AlbumItemEdit) => {
    return i.checked === true;
  });
  albumRefs.value.forEach((myref: AlbumItemComponent) => {
    if (checkedAll) {
      myref.resetChecked();
    } else {
      myref.forceChecked();
    }
  });
};
const onSortItem = () => {
  itemList.value = getAlbumItemsWithIndex(dragList.value);
};

/**
 * onUploadFiles
 */
const onUploadFiles = async (e: InputEvent) => {
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

  const res = await saveSelectedState();
  if (res.error) {
    toast.ng('アップロード後アルバム保存に失敗したケロ');
    return res.error;
  }
  toast.ok('アップロードしたケロ');
};

/**
 * saveTitle
 */
const saveTitle = async () => {
  await backupAlbum(albumId);
  // アルバム保存
  const res: any = await saveAlbumDetail(albumId, {
    ...albumData.value,
    albumTitle: form.albumTitle,
  });

  if (res.error) {
    toast.ng(`❗️タイトル保存エラー ${res.error}`);
    return;
  }
  await refresh();
  savedTitle.value = true;
  setTimeout(() => {
    savedTitle.value = false;
  }, 2000);
};

/**
 * saveDescription
 */
const saveDescription = async () => {
  await backupAlbum(albumId);
  // アルバム保存
  const res: any = await saveAlbumDetail(albumId, {
    ...albumData.value,
    albumDescription: form.albumDescription,
  });

  if (res.error) {
    toast.ng(`❗️説明保存エラー ${res.error}`);
    return;
  }
  await refresh();
  savedDescription.value = true;
  setTimeout(() => {
    savedDescription.value = false;
  }, 2000);
};

/**
 * saveConclusion
 */
const saveConclusion = async () => {
  await backupAlbum(albumId);
  // アルバム保存
  const res: any = await saveAlbumDetail(albumId, {
    ...albumData.value,
    albumConclusion: form.albumConclusion,
  });

  if (res.error) {
    toast.ng(`❗️まとめ保存エラー ${res.error}`);
    return;
  }
  await refresh();
  savedConclusion.value = true;
  setTimeout(() => {
    savedConclusion.value = false;
  }, 2000);
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
  return res;
};

/**
 * saveItem
 */
const saveItem = async (item: AlbumItemEdit | AlbumItemEdit[]) => {
  await backupAlbum(albumId);
  let items: AlbumItemEdit[] = [];
  if (Array.isArray(item)) {
    items = item;
  } else {
    items = itemList.value.map((i) => {
      if (i.id === item.id) return item;
      return i;
    });
  }
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    items: items.map((i) => getAlbumItemForSend(i)),
  });
  if (res.error) {
    toast.ng(`❗️アイテム情報保存エラー ${res.error}`);
    return false;
  }
  await refresh();

  // 保存したエフェクト
  const targetRef = albumRefs.value.find((myref: AlbumItemComponent) => {
    return myref.$props.id === item.id;
  });
  if (targetRef) targetRef.showSaved();
  return true;
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
 * startUploadingFireStorage
 *
 */
const startUploadingFireStorage = async () => {
  uploadingFireBase.doing = true;
  const list = getAlbumItemsWithIndex(dragList.value);
  const errors = [];
  uploadingFireBase.count = 0;
  uploadingFireBase.total = list.length;

  const res1 = await exportAlbum(albumId);
  if (res1.error) {
    toast.ng(`エクスポートに失敗 ${res1.error}`);
    return;
  }

  await list.reduce((ps: Promise<any>, item: AlbumItemEdit) => {
    return ps.then(async () => {
      const res = await saveAlbumImageToFireStorage(albumId, [item]);
      const { result } = res;
      if (!result) {
        console.log('resultなし', item.index);
        errors.push(item.index);
        return;
      }
      const t = result[item.index];
      if (t.error) {
        console.log('firebaseアップロードエラー', t.error);
        errors.push(item.index);
      } else {
        item.firebaseUrl = t.url;
        uploadingFireBase.count += 1;
      }
      console.log('つぎへ');
    });
  }, Promise.resolve());

  if (errors.length > 0) {
    toast.ng(`firebaseアップロードにてエラー発生 ${errors}`);
    return;
  }

  const res3 = await saveItem(list);
  if (!res3) {
    return;
  }
  // firebaseUrlつきでエクスポートする
  const res4 = await exportAlbum(albumId);
  if (res4.error) {
    toast.ng(`エクスポートに失敗 ${res4.error}`);
    return;
  }
  toast.ok('firebaseアップロード完了');

  uploadingAlbum.value = false;
  uploadingFireBase.doing = false;
};

/**
 * startSaveSortIndex
 *
 */
const startSaveSortIndex = async () => {
  await backupAlbum(albumId);
  // アルバム保存
  const res: any = await saveAlbumDetail(albumId, {
    ...albumData.value,
    items: itemList.value.map((i) => getAlbumItemForSend(i)),
  });
  if (res.error) {
    return res.error;
  }
  await refresh();
  toast.ok('Saved');
};

/**
 * startSaveSelectedState
 */
const startSaveSelectedState = async () => {
  await backupAlbum(albumId);
  const res = await saveSelectedState();
  deleting.value = false;
  if (res.error) {
    toast.ng(`❗️ ${res.error}`);
    return;
  }
  await refresh();
  toast.ok('Deleted');
};

const getAlbumItemForSend = (i: AlbumItemEdit): Item => {
  return {
    index: i.index,
    id: i.id,
    img: i.img,
    title: i.title,
    description: i.description,
    firebaseUrl: i.firebaseUrl,
  };
};

const getAlbumItemsWithIndex = (ary: AlbumItemEdit[]) => {
  return ary.concat().map((i: AlbumItemEdit, index: number) => {
    return { ...i, index: zeropad(index, 5) };
  });
};

const startExportAlbum = async () => {
  loadingOverlay.open();
  const res = await exportAlbum(albumId);
  loadingOverlay.close();
  if (res.error) {
    toast.ng(`エクスポートに失敗 ${res.error}`);
    return;
  }

  toast.ok('エクスポートを完了');
};

/**
 * saveSelectedState
 *
 */
const saveSelectedState = async () => {
  const items = itemList.value;
  const itemsActive = items.filter((i: AlbumItemEdit) => !!i.checked === false);
  const itemsRemove = items.filter((i: AlbumItemEdit) => !!i.checked === true);

  loadingOverlay.open();

  // アイテム削除
  try {
    await itemsRemove.reduce((ps: Promise<any>, i: AlbumItemEdit) => {
      return ps.then(async () => {
        const res = await removeAlbumImage(albumId, i.id);
        if (res.error) {
          throw new Error(res.error);
        }
      });
    }, Promise.resolve());
  } catch (error) {
    loadingOverlay.close();
    return { error: error.message };
  }

  // アルバム保存
  const res: any = await saveAlbumDetail(albumId, {
    ...albumData.value,
    items: itemsActive.map((i) => getAlbumItemForSend(i)),
  });
  if (res.error) {
    loadingOverlay.close();
    return res.error;
  }
  loadingOverlay.close();
  return { removed: true };
};

const moveUp = async (index: number) => {
  if (index === 0) return;
  const ary = [...itemList.value];
  const item = ary[index];
  ary.splice(index, 1);
  ary.splice(index - 1, 0, item);
  // ary.unshift(item);
  itemList.value = getAlbumItemsWithIndex(ary);
};

const moveDown = async (index: number) => {
  const ary = [...itemList.value];
  if (index === ary.length - 1) return;
  const item = ary[index];
  ary.splice(index, 1);
  ary.splice(index + 1, 0, item);
  // ary.push(item);
  itemList.value = getAlbumItemsWithIndex(ary);
};

const clearChecked = () => {
  albumRefs.value.forEach((myref: AlbumItemComponent) => {
    myref.resetChecked();
  });
};

const onSelectMoveIndex = (e) => {
  form.moveIndex = e.target.value;
};

type RemoveItem = { item: AlbumItemEdit; remove: boolean };

/**
 * 指定インデックスに選択アイテムを移動
 */
const bulkMove = async () => {
  await backupAlbum(albumId);
  const moveIndex = +form.moveIndex + 1;
  const selectedItemIds = selectedItems.value;
  /**
   * 全アイテムのフィルタ配列を生成（移動アイテムに削除フラグを付与）
   */
  const ary: RemoveItem[] = [...itemList.value].map(
    (i: AlbumItemEdit): RemoveItem => {
      const find = selectedItemIds.find((i2: AlbumItemEdit) => {
        return i2.id === i.id;
      });
      return { item: i, remove: Boolean(find) };
    },
  );
  if (moveIndex > ary.length) {
    return;
  }

  /**
   * 指定インデックスに追加するため、
   * 選択されたアイテムのフィルタ配列（削除フラグなし）を作成
   */
  const items: RemoveItem[] = ary
    .filter((data) => data.remove)
    .map((data) => {
      return { ...data, remove: false };
    });

  /**
   * 指定インデックスに追加
   */
  ary.splice(moveIndex, 0, ...items);

  /**
   * 削除フラグを除外した配列を生成
   */
  const filtered: AlbumItemEdit[] = ary
    .filter((a) => {
      return !a.remove;
    })
    .map((a) => {
      return a.item;
    });

  // 選択解除
  clearChecked();
  form.moveIndex = '';
  await nextTick();

  itemList.value = getAlbumItemsWithIndex(filtered);
};

const hasSortChanges = computed(() => {
  const ary1 = itemList.value;
  const ary2 = itemListBk;
  if (ary1.length !== ary2.length) return true;
  let hasDiff = false;
  for (let i = 0; i < ary1.length; i++) {
    const itemA = ary1[i];
    const itemB = ary2[i];
    if (itemA.id !== itemB.id) {
      hasDiff = true;
      break;
    }
  }

  return hasDiff;
});

const saveIndexBtnClass = computed(() => {
  const ret = {};
  if (hasSortChanges.value) {
    ret['-show'] = true;
  }

  return ret;
});

//----------------------
// use
//----------------------
</script>

<style scoped lang="scss">
.btn-saveIndex {
  display: block;
  position: absolute;
  top: -32px;
  left: 140px;
  // box-shadow: 0 0 2px 1px white;
  border: solid 1px #fff;
  transition: all 0.3s ease;
  pointer-events: none;
  &.-show {
    top: -5px;
    pointer-events: auto;
  }

  &[disabled] {
    opacity: 1;
    border: solid 1px #fff;
  }
  &:hover {
    border: solid 1px #fff;
  }
}
.albumDescription {
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
.bottomUI {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #f7c505;
  border-bottom: solid 1px #fff;
  padding: 20px 30px 20px;
  box-shadow: 0 0 4px 2px rgba(black, 0.13);
  width: 100%;
  height: 50px;

  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  .myform {
    margin: 0;
  }

  &.-moveItem {
    top: -50px;

    transition: all 0.3s ease;
    &.-show {
      top: 0;
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
  .btn-right {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
