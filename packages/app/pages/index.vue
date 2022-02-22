<template>
  <main class>
    <GlobalHeader>
      <o-dropdown class="ml-3" position="bottom-left" ref="pulldown">
        <template #trigger>
          <o-button size="small" variant="primary">新規アルバム</o-button>
        </template>

        <FormInput
          name="albumId"
          placeholder="アルバムID（30文字以下）"
          label="アルバム作成"
          class="px-3 w-300px"
          size="small"
          :yup="
            $vali.yup(yup.string(), $vali.max(30), $vali.id(), $vali.required())
          "
          expanded
        >
          <template v-slot:right="{ meta, val }">
            <o-button
              size="small"
              variant="primary"
              :disabled="!meta.valid"
              @click="(e) => createAlbum(e, val)"
              >追加</o-button
            >
          </template>
        </FormInput>
      </o-dropdown>
    </GlobalHeader>

    <section class="container pt-70px">
      <p class="py-3 text-lg">アルバム一覧</p>

      <AlbumList :albums="albums" @clickAlbum="onClickAlbum" />
    </section>
    <!-- <LoadingOverlay :active="s.isImageModalActive" /> -->
  </main>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { useNuxtApp } from '#app';
import type { Album } from '@/types/apptype';
const pulldown = ref(null);
// const { context } = useNuxtApp();
// const router = useRouter();

//----------------------
// state
//----------------------
// const s = reactive<State>({
//   isImageModalActive: false,
//   visibleFormModal: false,
// });

//----------------------
// use
//----------------------
const { appState } = useAppState();
const { albums, refresh } = useAlbumList();
//----------------------
// func
//----------------------
const onClickAlbum = (album: Album) => {
  location.href = `/albums/${album.name}/`;
};

const createAlbum = async (e: HTMLButtonElement, val: string) => {
  // close anyway
  pulldown.value.selectItem(0);
  const album: Album = {
    name: val,
    path: '',
    thumbnail: '',
    albumDescription: '',
  };
  const res = await saveAlbumDetail(album.name, {
    ...album,
  });
  console.log('res', res);
  refresh();
};
</script>
