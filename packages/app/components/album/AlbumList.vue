<template>
  <ul class="albumlist">
    <li
      v-for="(a, index) in albums"
      :key="`album${index}`"
      class="album mr-4 mb-4"
    >
      <a class="album-link" @click="() => $emit('clickAlbum', { ...a })">
        <img :src="a.thumbnail" />
        <p class="album-id">{{ a.name.slice(0, 9) }}</p>
      </a>
      <p class="py-1">{{ a.name }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Album, AlbumItem } from '@/types/apptype';
const props = defineProps({
  albums: {
    type: Array as PropType<Album[]>,
    default: () => [],
  },
});

const albums = computed(() => {
  return props.albums.reverse();
});
</script>

<style scoped lang="scss">
.albumlist {
  display: flex;
  flex-wrap: wrap;
}

.album-link {
  position: relative;
  display: block;
  width: 200px;
  height: 160px;
  border: solid 1px #eee;
  border-radius: 4px;
  box-shadow: 0 0 1px 1px rgba(#000, 0.01);
  background-color: #f7f7f7;
  background-image: url('/img/60-lines.png');
  &:hover {
    background-color: #f9f9f9;
  }
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
.album-id {
  position: absolute;
  top: 10px;
  left: 0;
  // transform: translateY(-50%);
  width: 100%;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 30px;
  text-shadow: 0 1px 3px rgba(#000, 0.3), 0 -1px 3px rgba(#000, 0.3);
}
</style>
