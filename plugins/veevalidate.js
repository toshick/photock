import { defineNuxtPlugin } from '#app';
import * as yup from 'yup';

const ValidationSchema = {
  install(app) {
    if (!app.config.globalProperties.$vali)
      app.config.globalProperties.$vali = {
        /**
         * merge provided yup schemas all
         */
        yup: (firstSchema, ...args) => {
          const ary = [].slice.call(args);
          return ary.reduce((schema, func) => {
            return func(schema);
          }, firstSchema);
        },
        /**
         * required
         */
        required:
          (msg = '必須だケロ') =>
          (schema) =>
            schema.required(msg),
        /**
         * id
         */
        id:
          (msg = 'IDは半角英数、ハイフン、アンダースコアにしてケロ') =>
          (schema) =>
            schema.matches(/^[0-9a-zA-Z_-]+$/, msg),
        /**
         * max
         */
        max: (num, msg) => (schema) => {
          if (!msg) msg = `${num}文字以下にするケロ`;
          return schema.max(num, msg);
        },
      };
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ValidationSchema);
});
