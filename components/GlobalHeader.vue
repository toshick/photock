<template>
  <header class="vcenter">
    <div class="container vcenter py-2">
      <h1 class="font-bold text-white text-2xl">
        <NuxtLink to="/">PHOTOCK</NuxtLink>
      </h1>
      <div class="ml-6">
        <slot name="left" />
      </div>
      <div class="ml-auto">
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.vcenter {
  display: flex;
  align-items: center;
}
header {
  background-color: var(--primary-color);
  background-image: url('/img/60-lines.png');
  position: sticky;
  top: 0;
  z-index: 5;
  border-bottom: solid 1px #a13838;
}
h1 {
  a {
    color: white;
    text-shadow: 0 1px 2px rgba(#000, 0.3);
  }
}
</style>
