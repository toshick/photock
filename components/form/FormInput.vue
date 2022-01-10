<template>
  <o-field :message="errorMessage" :label="label">
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

<script setup lang="ts">
import i18next from 'i18next';
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
const { context } = useNuxtApp();
// const MY_VARIANTS = ['required'];
const props = defineProps({
  name: {
    type: String,
    required: true,
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
  initialValue: {
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
const schema = computed(() => {
  return yup.object({
    [props.name]: props.yup,
  });
});
const onIconClick = () => {
  if (props.icon) {
    context.emit('icon');
  }
};
const inputType = computed(() => (props.textarea ? 'textarea' : 'text'));

// Create a form context with the validation schema
useForm({
  validationSchema: schema,
});
onMounted(() => {});

const {
  value: myval,
  errorMessage,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.initialValue,
});
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
</style>
