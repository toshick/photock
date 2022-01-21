<template>
  <o-field
    :message="props.hideErrorMessage ? '' : errorMessage"
    :label="label"
    :class="myClass"
  >
    <o-input
      v-model="myval"
      :placeholder="placeholder"
      :size="size"
      :icon="icon"
      icon-clickable
      @icon-click="onIconClick"
      :expanded="expanded"
      :type="inputType"
    />
    <slot name="right" :meta="meta" :val="myval" />
  </o-field>
</template>

<script setup lang="ts" emits="['input']">
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
// const emit = defineEmits<(name: string, val?: any) => any>();
const emit = defineEmits(['input', 'icon']);

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  val: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  hideErrorMessage: {
    type: Boolean,
    default: false,
  },
  topMessage: {
    type: Boolean,
    default: false,
  },
  textarea: {
    type: Boolean,
    default: false,
  },
  yup: {
    type: Object as PropType<yup.AnySchema>,
    default: null,
  },
});
const myClass: { [key: string]: boolean } = {
  myform: true,
};
if (props.class) {
  props.class.split(' ').forEach((str) => {
    myClass[str] = true;
  });
}
if (props.topMessage) {
  myClass['-top-message'] = true;
}

const inputType = computed(() => (props.textarea ? 'textarea' : 'text'));
const myPropVal = computed(() => props.val);
const schema = computed(() => {
  return yup.object({
    [props.name]: props.yup,
  });
});
useForm({
  validationSchema: schema,
});

const { value: myval, errorMessage, meta } = useField(props.name);
watch(myPropVal, () => {
  if (myPropVal.value !== myval.value) {
    myval.value = props.val;
  }
});

watch(myval, () => {
  emit('input', myval.value);
});

onMounted(() => {
  myval.value = myPropVal.value;
});
const onIconClick = () => {
  if (props.icon) {
    emit('icon');
  }
};
</script>

<style lang="scss">
.field {
  position: relative;
  // display: inline-block;
  // margin: 0;
  & > .label {
    font-weight: normal;
  }
  &.-top-message {
    .help {
      position: absolute;
      bottom: 100%;
      left: 0;
      padding-bottom: 4px;
      white-space: nowrap;
    }
  }
}
.help {
  color: var(--danger-color);
}
.input {
  background: linear-gradient(#fae9e8, #f7dbd9);
  // border-color: rgba(#e7796a, 0.6);
  border: solid 1px #fff;

  &:hover {
    border: solid 1px #fff;
  }
}
</style>
