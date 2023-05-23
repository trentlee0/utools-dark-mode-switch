import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import utools from 'vite-plugin-utools'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist/'
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    utools({
      external: 'utools-api',
      preload: {
        path: './src/preload.ts',
        watch: true,
        name: 'window.preload'
      },
      buildUpx: {
        pluginPath: './plugin.json',
        outDir: 'dist-upx',
        outName: '[pluginName]_[version].upx'
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      }
    ]
  }
})
