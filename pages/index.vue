<template>
  <main class>
    <GlobalHeader>
      <o-dropdown position="bottom-right">
        <template #trigger>
          <o-button size="small" variant="primary">新規アルバム</o-button>
        </template>

        <o-field class="px-3">
          <o-input
            placeholder="アルバムID"
            size="small"
            @icon-click="() => {}"
          ></o-input>
          <o-button size="small" variant="primary">追加</o-button>
        </o-field>
      </o-dropdown>
    </GlobalHeader>

    <section class="container py-3">
      <p class="pb-10">アルバムいちらん</p>

      <AlbumList :albums="albums" @clickAlbum="onClickAlbum" />

      <div>
        <o-button size="small" @click="clickMe">Click Me</o-button>
        <o-button size="small" rounded @click="refetchAlbum"
          >refetchAlbum</o-button
        >

        <h3 class="subtitle mt-10">With Icons</h3>
        <o-field>
          <o-input
            placeholder="Search..."
            type="search"
            icon="search"
            icon-clickable
            @icon-click="() => {}"
          ></o-input>
        </o-field>
      </div>
    </section>
    <LoadingOverlay :active="s.isImageModalActive" />
    <FormModal
      title="アルバム名"
      :show="s.visibleFormModal"
      @close="s.visibleFormModal = false"
    />
    {{ appState }}
  </main>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import type { Album } from '@/types/apptype';
import { callPost } from '@/util/fetch';
const { $router, $oruga } = useNuxtApp();
type State = {
  isImageModalActive: boolean;
  visibleFormModal: boolean;
};

//----------------------
// state
//----------------------
const s = reactive<State>({
  isImageModalActive: false,
  visibleFormModal: false,
});

//----------------------
// use
//----------------------
const { appState } = useAppState();
const { albums, refresh } = useAlbumList();

//----------------------
// func
//----------------------
const clickMe = () => {
  s.isImageModalActive = true;
  setTimeout(() => {
    s.isImageModalActive = false;
  }, 1500);
};
const refetchAlbum = () => {
  refresh();
};
const onClickAlbum = (album: Album) => {
  $router.push(`/albums/${album.name}`);
};
const onClickAlbumCreate = () => {
  s.visibleFormModal = true;
  appState.appName = 'うううう';
};
const onClose = () => {
  console.log('onCloseだ');
};

const createAlbum = async () => {
  const album: Album = {
    name: 'dummy',
    path: '',
    thumbnail: '',
    description: 'せつめいだぞ',
  };
  const res = await callPost(`/api/albums/${album.name}`, {
    ...album,
  });
  console.log('res', res);
  refresh();
};
</script>
