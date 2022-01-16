<template>
  <header>
    <div class="container flex p-2">
      <h1 class="font-bold text-white text-2xl">
        <NuxtLink to="/">PHOTOCK</NuxtLink>
      </h1>
      <div class="ml-auto">
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
header {
  background-color: var(--primary-color);
  background-image: url('/img/60-lines.png');
  position: sticky;
  top: 0;
  z-index: 5;
}
h1 {
  a {
    color: white;
    text-shadow: 0 1px 2px rgba(#000, 0.3);
  }
}
</style>
