import { defineNuxtConfig } from 'nuxt3';
const backendURL = 'http://localhost:9000';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  meta: {
    script: [
      {
        src: 'https://kit.fontawesome.com/353baaae27.js',
        crossorigin: 'anonymous',
      },
    ],
  },
  buildModules: ['nuxt-windicss'],
  css: ['@/assets/app.scss'],
  publicRuntimeConfig: {
    backendURL,
  },
  privateRuntimeConfig: {
    backendURL,
  },
});
