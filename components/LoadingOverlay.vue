<template>
  <transition name="fade">
    <o-modal
      :active="props.active"
      class="modal-loading"
      :canCancel="[]"
      animation=""
    >
      <p style="text-align: center">
        <img src="/img/gohan.png" />
      </p>
    </o-modal>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.modal-loading > .animation-content {
  pointer-events: none;
}
</style>
