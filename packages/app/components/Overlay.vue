<template>
  <o-modal
    :active="props.active"
    class="modal-overlay"
    :canCancel="['esc']"
    animation="fade"
  >
    <div>
      <slot />
      <slot name="description" />
    </div>
  </o-modal>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});
//----------------------
// state
//----------------------
</script>

<style lang="scss">
.modal-loading > .animation-content {
  pointer-events: none;
}
</style>
