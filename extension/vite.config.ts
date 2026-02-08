import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Custom plugin to copy manifest and HTML files
function copyExtensionAssets() {
  const distDir = resolve(__dirname, 'dist');
  
  // Copy manifest.json
  copyFileSync('manifest.json', join(distDir, 'manifest.json'));
  
  // Copy HTML files
  if (existsSync('popup.html')) {
    copyFileSync('popup.html', join(distDir, 'popup.html'));
  }
  if (existsSync('settings.html')) {
    copyFileSync('settings.html', join(distDir, 'settings.html'));
  }
  
  // Copy icons directory
  const iconsSource = 'public/icons';
  if (existsSync(iconsSource)) {
    const iconsDest = join(distDir, 'icons');
    mkdirSync(iconsDest, { recursive: true });
    copyFileSync(join(iconsSource, 'icon16.png'), join(iconsDest, 'icon16.png'));
    copyFileSync(join(iconsSource, 'icon48.png'), join(iconsDest, 'icon48.png'));
    copyFileSync(join(iconsSource, 'icon128.png'), join(iconsDest, 'icon128.png'));
  }
  
  console.log('Extension assets copied to dist/');
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-assets',
      writeBundle() {
        copyExtensionAssets();
      },
      apply: 'closeBundle'
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.tsx'),
        settings: resolve(__dirname, 'src/popup/Settings.tsx'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
