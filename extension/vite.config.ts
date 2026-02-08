import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-assets',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        
        // Copy manifest.json (don't overwrite HTML - Vite handles those)
        if (existsSync('manifest.json')) {
          copyFileSync('manifest.json', join(distDir, 'manifest.json'));
        }
        
        // Copy icons directory
        const iconsSource = 'public/icons';
        if (existsSync(iconsSource)) {
          const iconsDest = join(distDir, 'icons');
          mkdirSync(iconsDest, { recursive: true });
          for (const file of readdirSync(iconsSource)) {
            copyFileSync(join(iconsSource, file), join(iconsDest, file));
          }
        }
        
        console.log('✅ Extension assets copied to dist/');
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        settings: resolve(__dirname, 'settings.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background and content scripts at root level
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: './',
});
