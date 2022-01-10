<template>
  <article class="imgitem">
    <div>
      <FormInput
        name="title"
        placeholder="タイトル（40文字以下）"
        class="py-3 w-300px"
        size="small"
        :yup="$vali.yup(yup.string(), $vali.max(40))"
        expanded
      >
      </FormInput>
    </div>
    <figure class="imgitem-img">
      <img :src="item.img" alt="" />
      <o-button
        tag="a"
        variant="primary"
        @click="() => $emit('remove', { ...item })"
        size="small"
        class="imgitem-remove"
      >
        <span>remove</span>
      </o-button>
      <o-button
        tag="a"
        variant="info"
        @click="() => $emit('save', { ...item })"
        size="small"
        class="imgitem-save"
      >
        <span>save</span>
      </o-button>
    </figure>
    <div>
      <FormInput
        textarea
        name="description"
        placeholder="せつめい"
        class="py-1 w-full"
        size="small"
        v-model="description"
        :yup="$vali.yup(yup.string())"
        :initialValue="'ううう'"
        expanded
      >
      </FormInput>
      description: {{ description }}
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { AlbumItem } from '@/types/apptype';
import * as yup from 'yup';
const props = defineProps({
  item: {
    type: Object as PropType<AlbumItem>,
    default: () => {},
  },
});

const description = ref('');

const item = computed(() => props.item);
</script>

<style scoped lang="scss">
.imgitem {
  position: relative;

  &-img {
    display: inline-block;
    position: relative;
    &:hover {
      .imgitem-remove,
      .imgitem-save {
        display: block;
      }
    }
  }
  &-remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
  &-save {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
  }
  img {
    display: block;
    max-width: 320px;
    max-height: 400px;
  }
}
</style>
