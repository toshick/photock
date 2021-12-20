module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
  ],
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['vue', '@typescript-eslint', '@typescript-eslint/eslint-plugin'],
};
