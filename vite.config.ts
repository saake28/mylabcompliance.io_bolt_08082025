import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        superAdmin: './super-admin-entry.html',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
