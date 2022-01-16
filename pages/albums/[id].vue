<template>
  <main class>
    <GlobalHeader>
      <o-upload @input="onSelectFiles" multiple>
        <o-button tag="a" variant="primary" size="small" class="mx-3">
          <span
            ><i class="mr-2 fas fa-arrow-alt-circle-up"></i>イメージ追加</span
          >
        </o-button>
      </o-upload>
      <o-button size="small" variant="primary" @click="resetting = true"
        >リセット</o-button
      >
    </GlobalHeader>

    <section class="container py-6">
      <p class="pb-4 text-lg">アルバムID: {{ albumId }}</p>
      <p class="pb-2 text-md">アルバム説明</p>
      <!-- description -->
      <FormInput
        textarea
        name="albumDescription"
        placeholder="アルバム説明"
        class="w-screen-lg albumDescription"
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
            @click="save"
            :disabled="!albumDescriptionEditted"
          >
            <span>保存</span>
          </o-button>
        </template>
      </FormInput>

      <!-- <div>
        {{ albumData }}
      </div> -->
    </section>
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
              :index="index + 1"
              :item="element"
              @remove="removeItem"
              @save="saveItem"
              :saved="
                itemReactiveData[element.id] &&
                itemReactiveData[element.id].saved
              "
            />
          </li>
        </template>
      </draggable>
    </section>

    <transition name="fade">
      <o-modal :active="resetting" class="modal-resetting" :canCancel="['esc']">
        <div class="text-lg">
          <a class="text-red-500 px-4" @click="reset"
            ><i class="fas fa-exclamation-triangle pr-2"></i>リセット</a
          >
          <a class="text-gray-500 px-4" @click="resetting = false"
            >キャンセル</a
          >
        </div>
      </o-modal>
    </transition>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import * as yup from 'yup';
import draggable from 'vuedraggable';
import type { AlbumItem } from '@/types/apptype';
import { createToast, asort } from '@/util/helper';

const oruga = inject('oruga');
const toast = createToast(oruga);
const r = useRoute();
const albumId = r.params.id as string;
const { albumData, refresh } = await useAlbumDetail(albumId);

console.log('albumData', { ...albumData.value });

const dragList = ref([]);
const drag = ref(false);
const resetting = ref(false);
const itemReactiveData = reactive<{ [key: string]: { saved: boolean } }>({});
const form = reactive({
  albumDescription: albumData.value.albumDescription || '',
});
const albumDescriptionEditted = computed(() => {
  return form.albumDescription !== albumData.value.albumDescription;
});

watchEffect(() => {
  albumData.value.items.forEach((i: AlbumItem) => {
    if (!itemReactiveData[i.id]) {
      itemReactiveData[i.id] = { saved: false };
    }
  });
  dragList.value = asort([...albumData.value.items], 'index');
});

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

  await save(false);
  toast.ok('アップロードしたケロ');
};

/**
 * save
 */
const save = async (withToast: boolean = true) => {
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    albumDescription: form.albumDescription || '',
  });
  if (res.error) {
    toast.ng(`❗️アルバム情報保存エラー ${res.error}`);
    return;
  }
  if (withToast) {
    toast.ok('保存したケロ');
  }
  refresh();
};

/**
 * removeItem
 */
const removeItem = async (item: AlbumItem) => {
  const res = await removeAlbumImage(albumId, item.id);
  if (res.error) {
    toast.ng(`❗️画像削除エラー ${res.error}`);
    return;
  }
  toast.ok('削除したケロ');
  refresh();
};

/**
 * saveItem
 */
const saveItem = async (item: AlbumItem) => {
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
  refresh();
  itemReactiveData[item.id].saved = true;
  setTimeout(() => {
    itemReactiveData[item.id].saved = false;
  }, 500);
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
  toast.ok('リセットしたケロ');
  refresh();
};

/**
 * reload
 */
const reload = async () => {
  refresh();
  toast.ok('リセットしたケロ');
};

/**
 * onChangeSort
 */
const onChangeSort = async ({ moved }) => {
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
    items: [...dragList.value],
  });
  if (res.error) {
    toast.ng(`❗️ソート保存エラー ${res.error}`);
    return;
  }
  // toast.ok('順番変えたケロ');
  refresh();
};

//----------------------
// use
//----------------------
</script>

<style scoped lang="scss">
.imglist {
  display: flex;
  flex-wrap: wrap;
}
.imglist-item {
  // width: 50%;
  margin: 0px 20px 30px 0;
}
</style>
