import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts(),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'mdast-util-from-markdown',
        'mdast-util-gfm',
        'mdast-util-to-vnode',
        'micromark-extension-gfm',
        'shiki',
        'shiki/core',
        'shiki/engine/javascript',
        'shiki/langs/css.mjs',
        'shiki/langs/html.mjs',
        'shiki/langs/javascript.mjs',
        'shiki/langs/json.mjs',
        'shiki/langs/markdown.mjs',
        'shiki/langs/typescript.mjs',
        'shiki/langs/vue.mjs',
        'shiki/themes/catppuccin-latte.mjs',
        'shiki/themes/catppuccin-mocha.mjs',
        '@libeilong/h5'
      ]
    }
  },
})
