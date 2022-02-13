<template>
  <article class="imgitem" :class="myClass">
    <!-- ヘッダ -->
    <header class="imgitem-header">
      <span class="handle pr-4">
        {{ index }}
        <i class="fas fa-bars"></i>
      </span>
      <FormInput
        name="title"
        placeholder="タイトル（40文字以下）"
        class="block"
        size="small"
        :yup="$vali.yup(yup.string(), $vali.max(40))"
        :val="form.title"
        :top-message="true"
        expanded
        @input="(val:string) => (form.title = val)"
        @keydown="onKeyDown"
      >
      </FormInput>
      <p class="ml-2">
        <o-checkbox v-model="checked"></o-checkbox>
      </p>
    </header>
    <div class="imgitem-body">
      <!-- イメージ -->
      <div class="imgitem-img">
        <figure class="imgitem-imgholder">
          <img :src="item.img" :alt="item.id" loading="lazy" />
          <!-- 右側 -->
          <nav class="imgitem-ui imgitem-ui-r">
            <!-- もどすボタン -->
            <a v-if="editted" class="btn-revert iconbutton" @click="revert"
              ><i class="fas fa-undo"></i
            ></a>
          </nav>
          <!-- 保存ボタン -->
          <a
            v-if="editted"
            class="btn-save iconbutton"
            @click="
              $emit('save', {
                ...item,
                title: form.title,
                description: form.description,
              })
            "
            ><i class="fas fa-arrow-up"></i
          ></a>
          <!-- 左側 -->
          <nav class="imgitem-ui imgitem-ui-l">
            <!-- 削除ボタン -->
            <!-- <a class="btn-remove iconbutton" @click="state.removing = true"
              ><i class="far fa-trash-alt"></i
            ></a> -->
            <!-- 移動ボタン -->
            <a class="btn-remove iconbutton" @click="$emit('move-up')"
              ><i class="fas fa-chevron-up"></i
            ></a>
            <!-- 移動ボタン -->
            <a class="btn-remove iconbutton" @click="$emit('move-down')"
              ><i class="fas fa-chevron-down"></i
            ></a>
          </nav>
        </figure>
        <!-- 削除確認 -->
        <div class="imgitem-img-confirm-remove" v-if="state.removing">
          <div>
            <a
              class="btn-confirm-save"
              @click="() => $emit('remove', { ...item })"
              ><i class="far fa-trash-alt"></i>削除</a
            >
            <a class="btn-confirm-cancel" @click="state.removing = false"
              >キャンセル</a
            >
          </div>
        </div>
        <!-- description -->
        <FormInput
          textarea
          name="description"
          placeholder="せつめい"
          class="w-full imgitem-description"
          size="small"
          :yup="$vali.yup(yup.string())"
          :val="form.description"
          expanded
          @input="(val:string) => (form.description = val)"
          @keydown="onKeyDown"
        >
        </FormInput>
      </div>
      <!-- Saved -->
      <transition name="fade">
        <div v-if="saved" class="imgitem-img-saved">
          <span>
            <i class="fas fa-check"></i>
            Saved</span
          >
        </div>
      </transition>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { AlbumItem } from '@/types/apptype';
import * as yup from 'yup';
import { zeropad } from '@/util/helper';

const emit = defineEmits(['checked', 'save', 'remove', 'move-up', 'move-down']);
const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  id: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  item: {
    type: Object as PropType<AlbumItem>,
    default: () => {},
  },
  saved: {
    type: Boolean,
    default: false,
  },
  uploaded: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  removing: false,
});
const form = reactive({
  title: props.item.title || '',
  description: props.item.description || '',
});

const checked = ref(false);
const index = computed(() => zeropad(props.index || 0, 3));
const item = computed(() => props.item);
const saved = ref(false);
const editted = computed(() => {
  const formTitle = form.title || '';
  const propTitle = props.item.title || '';
  const formDescription = form.description || '';
  const propDescription = props.item.description || '';
  return formTitle !== propTitle || formDescription !== propDescription;
});
const myClass = computed(() => {
  return { '-editted': editted.value, [props.class]: true };
});
const revert = () => {
  form.title = props.item.title;
  form.description = props.item.description;
};
const resetChecked = () => {
  checked.value = false;
};
const forceChecked = () => {
  checked.value = true;
};
const showSaved = () => {
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
  }, 1000);
};
const onKeyDown = (e: any) => {
  if (e.metaKey && e.keyCode === 13) {
    e.preventDefault();
    saveData();
  }
};
const saveData = () => {
  emit('save', {
    ...props.item,
    title: form.title,
    description: form.description,
  });
};

watch(
  () => checked.value,
  () => {
    emit('checked', checked.value);
  },
);

defineExpose({ resetChecked, forceChecked, showSaved });
</script>

<style scoped lang="scss">
.imgitem {
  --oruga-tooltip-color: red;
  position: relative;

  &:hover {
    .imgitem-ui {
      & > a {
        display: block;
      }
    }
  }
  &-header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    .handle {
      cursor: pointer;
    }
    & > .field {
      flex: 1 0 auto;
      border-radius: 4px;
      margin: 0;
    }
  }
  &-body {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 2px 3px 1px rgba(#000, 0.13);
  }
  .btn-save {
    display: block;
    color: var(--primary-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    font-size: 20px;
    &::after {
      width: 50px;
      height: 50px;
      box-shadow: 0 2px 3px 1px rgba(#000, 0.13);
    }
  }
  .btn-revert {
    display: block;
  }
  .uploaded {
    display: block;
    position: absolute;
    bottom: -30px;
    right: 14px;
    color: var(--primary-color);
    pointer-events: none;
  }
  &-ui {
    & > a {
      display: none;
      color: #666;
      margin-bottom: 15px;

      &:hover {
        color: #888;
      }
      &::after {
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.4);
      }
    }
  }
  &-ui-l {
    position: absolute;
    top: 10px;
    left: 14px;
  }
  &-ui-r {
    position: absolute;
    top: 10px;
    right: 14px;
  }
  &-ui-b {
    position: absolute;
    bottom: 0px;
    right: 14px;
  }
  &-imgholder {
    position: relative;
    z-index: 1;

    img {
      display: block;
      width: 320px;
      height: 200px;
      object-fit: cover;
    }
  }
  &-img-confirm-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: rgba(white, 0.9);
    a {
      display: inline-block;
      margin: 0 10px;
      color: #333;
      text-shadow: 0 2px 2px white;
      &:hover {
        color: #888;
      }
    }
    i {
      margin-right: 0.3em;
    }
  }
  &-img-saved {
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
}
</style>

<style lang="scss">
.imgitem-description {
  .input {
    border-radius: 0 0 4px 4px;
    border-top: 0;
  }
}
</style>
