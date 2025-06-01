import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'XyflowVue',
      fileName: (format) => `xyflow-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@xyflow/system'],
      output: {
        globals: {
          vue: 'Vue',
          '@xyflow/system': 'XyflowSystem',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'xyflow-vue.css';
          return assetInfo.name;
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
