<template>
  <main class>
    <GlobalHeader>
      <o-button size="small" variant="primary" @click="onClickAlbumCreate"
        >新規アルバム</o-button
      >
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
  </main>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import type { Album } from '@/types/apptype';
import { callPost } from '@/util/fetch';
const { $router } = useNuxtApp();
type State = {
  isImageModalActive: boolean;
};

//----------------------
// state
//----------------------
const s = reactive<State>({
  isImageModalActive: false,
});

//----------------------
// fetch
//----------------------
const { data, pending, refresh, error } = useLazyFetch('/api/albums');
const albums: Album[] = data?.value?.albums || [];

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
const onClickAlbumCreate = async () => {
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
};
</script>
