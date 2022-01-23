<template>
  <transition name="fade">
    <div v-if="active" class="loading">
      <div class="loading-bg" />
      <div class="loading-cont">
        <img src="/img/gohan.png" />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const active = computed(() => props.active);
</script>

<style scoped lang="scss">
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 100vw;
  height: 100vh;
}
.loading-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(white, 0.9);
}
.loading-cont {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
