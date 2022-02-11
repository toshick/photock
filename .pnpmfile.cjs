module.exports = {
  hooks: {
    readPackage: (pkg) => {
      if (pkg.name === 'app') {
        pkg.dependencies['@nuxt/design'] = '^0.1.5';
        pkg.dependencies['@nuxt/devalue'] = '^2.0.0';
        pkg.dependencies['@nuxt/kit'] =
          'npm:@nuxt/kit-edge@3.0.0-27398533.8edd481';
        pkg.dependencies['@nuxt/nitro'] =
          'npm:@nuxt/nitro-edge@3.0.0-27398533.8edd481';
        pkg.dependencies['@nuxt/schema'] =
          'npm:@nuxt/schema-edge@3.0.0-27398533.8edd481';
        pkg.dependencies['@nuxt/vite-builder'] =
          'npm:@nuxt/vite-builder-edge@3.0.0-27398533.8edd481';
        pkg.dependencies['@nuxt/webpack-builder'] =
          'npm:@nuxt/webpack-builder-edge@3.0.0-27398533.8edd481';
        pkg.dependencies['@vue/reactivity'] = '^3.2.29';
        pkg.dependencies['@vue/shared'] = '^3.2.29';
        pkg.dependencies['@vueuse/head'] = '^0.7.5';
        pkg.dependencies['chokidar'] = '^3.5.3';
        pkg.dependencies['consola'] = '^2.15.3';
        pkg.dependencies['cookie-es'] = '^0.5.0';
        pkg.dependencies['defu'] = '^5.0.1';
        pkg.dependencies['destr'] = '^1.1.0';
        pkg.dependencies['escape-string-regexp'] = '^5.0.0';
        pkg.dependencies['globby'] = '^13.1.1';
        pkg.dependencies['h3'] = '^0.3.9';
        pkg.dependencies['hash-sum'] = '^2.0.0';
        pkg.dependencies['hookable'] = '^5.1.1';
        pkg.dependencies['ignore'] = '^5.2.0';
        pkg.dependencies['mlly'] = '^0.4.1';
        pkg.dependencies['murmurhash-es'] = '^0.1.1';
        pkg.dependencies['nuxi'] = 'npm:nuxi-edge@3.0.0-27398533.8edd481';
        pkg.dependencies['ohmyfetch'] = '^0.4.15';
        pkg.dependencies['pathe'] = '^0.2.0';
        pkg.dependencies['postcss'] = '^8.0.0';
        pkg.dependencies['rollup'] = '^2.0.0';
        pkg.dependencies['scule'] = '^0.2.1';
        pkg.dependencies['std-env'] = '^3.0.1';
        pkg.dependencies['ufo'] = '^0.7.9';
        pkg.dependencies['unenv'] = '^0.4.3';
        pkg.dependencies['unplugin'] = '^0.3.2';
        pkg.dependencies['vue'] = '^3.2.29';
        pkg.dependencies['vue-router'] = '^4.0.12';
        pkg.dependencies['vue-bundle-renderer'] = '^0.3.5';
      }
      return pkg;
    },
  },
};
