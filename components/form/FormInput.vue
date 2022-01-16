<template>
  <o-field :message="errorMessage" :label="label" :class="props.class">
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
  textarea: {
    type: Boolean,
    default: false,
  },
  yup: {
    type: Object as PropType<yup.AnySchema>,
    default: null,
  },
});
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
  display: inline-block;
  & > .label {
    font-weight: normal;
  }
}
.help {
  color: var(--danger-color);
}
.input {
  background-color: rgba(#e7796a, 0.1);
  border-color: rgba(#e7796a, 0.6);
}
</style>
