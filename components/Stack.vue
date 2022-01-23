<template>
  <div :class="klass" :style="styles">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  space: {
    type: Number,
    default: 0,
  },
});
const klass = {
  stack: true,
};
const styles = computed<Object>(() => ({
  '--stack-space-val': `calc(var(--stack-space) * ${props.space})`,
}));
</script>

<style lang="scss">
.stack > * + * {
  margin-block-start: var(--stack-space-val);
}
</style>
