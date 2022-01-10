<template>
  <main class>
    <GlobalHeader>
      <o-upload @input="onSelectFiles" multiple>
        <o-button tag="a" variant="primary" size="small" class="mx-3">
          <span>アップロード</span>
        </o-button>
      </o-upload>
      <o-button size="small" variant="primary" @click="reset"
        >リセット</o-button
      >
    </GlobalHeader>

    <section class="container py-6">
      <p class="pt-10 text-lg">アルバムしょうさい: {{ albumData.name }}</p>

      <!-- <div>
        {{ albumData }}
      </div> -->
    </section>
    <section class="container">
      <ul class="imglist">
        <li
          v-for="i in albumData.items"
          class="imglist-item"
          :key="`item-${i.id}`"
        >
          <AlbumItem :item="i" @remove="removeItem" @save="saveItem" />
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useNuxtApp } from '#app';
import type { Item } from '@/types/apptype';
import { createToast } from '@/util/helper';

const oruga = inject('oruga');
const toast = createToast(oruga);
const r = useRoute();
const albumId = r.params.id as string;
const { albumData, refresh } = useAlbumDetail(albumId);

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
  toast.ok('アップロードしたケロ');
  await refresh();
  await save(false);
};

/**
 * save
 */
const save = async (withToast: boolean = true) => {
  const res = await saveAlbumDetail(albumId, {
    ...albumData.value,
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
const removeItem = async (item: Item) => {
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
  toast.ok('保存したケロ');
  refresh();
};

/**
 * reset
 */
const reset = async () => {
  const res = await resetAlbumImage(albumId);
  if (res.error) {
    toast.ng(`❗️リセットエラー ${res.error}`);
    return;
  }
  toast.ok('リセットしたケロ');
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
  margin: 0px 15px 30px 0;
}
</style>
