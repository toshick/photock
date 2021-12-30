<template>
  <ul class="albumlist">
    <li
      v-for="(a, index) in albums"
      :key="`album${index}`"
      class="album mr-4 mb-4"
    >
      <a class="album-link" @click="() => $emit('clickAlbum', { ...a })"> </a>
      <p class="py-1">{{ a.name }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Album } from '@/types/apptype';
const props = defineProps({
  albums: {
    type: Array as PropType<Album[]>,
    default: () => [],
  },
});

const { albums } = props;
</script>

<style scoped lang="scss">
.albumlist {
  display: flex;
  flex-wrap: wrap;
}

.album-link {
  display: block;
  width: 200px;
  height: 200px;
  border: solid 1px #eee;
  border-radius: 4px;
  box-shadow: 0 0 1px 1px rgba(#000, 0.01);
  background-color: #f7f7f7;
  background-image: url('/img/60-lines.png');
  &:hover {
    background-color: #fff;
  }
}
</style>
