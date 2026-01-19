import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin to copy manifest.json to dist folder
const copyManifestPlugin = () => {
  return {
    name: 'copy-manifest',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      copyFileSync(
        path.resolve(__dirname, 'manifest.json'),
        path.resolve(distDir, 'manifest.json')
      );
    },
  };
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Vite automatically exposes env vars prefixed with VITE_ via import.meta.env
    // So we don't need to manually define them, but we can ensure they're loaded
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        copyManifestPlugin(),
        viteStaticCopy({
          targets: [
            {
              src: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
              dest: 'webfonts'
            },
            {
              src: 'assets/logo.png',
              dest: '.'
            }
          ]
        })
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            popup: path.resolve(__dirname, 'index.html'),
          },
        },
      },
      // Vite automatically exposes VITE_* env vars via import.meta.env
      // No need to manually define them here
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      css: {
        postcss: './postcss.config.js',
      },
    };
});
