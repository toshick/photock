<template>
  <main class>
    <GlobalHeader />

    <section class="container py-3">
      <p class="pb-10">アルバムしょうさい</p>

      <div>
        {{ albumData }}
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
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useNuxtApp } from '#app';
import type { Album } from '@/types/apptype';
const { id: albumId } = useRoute().params;

//----------------------
// use
//----------------------
const { albumData } = useAlbumDetail(albumId);
onMounted(() => {
  console.log('$router');
});
</script>
