<template>
  <transition name="fade">
    <o-modal :active="active" class="modal-loading" :canCancel="[]" ref="modal">
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
const modal = ref(null);
//----------------------
// state
//----------------------
const s = reactive({
  name: '',
  active: false,
});
const active = computed(() => s.active);
const doClose = () => {
  if (modal && modal.value?.close) {
    modal.value?.close();
    s.active = false;
  }
};
watchEffect(() => {
  if (props.active) {
    s.active = props.active;
  } else {
    doClose();
  }
});
</script>

<style lang="scss">
.modal-loading > .animation-content {
  pointer-events: none;
}
</style>
