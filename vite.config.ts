import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 4173, proxy: { '/workbench': 'http://127.0.0.1:4174', '/api': 'http://127.0.0.1:4174' } },
  preview: { port: 4173, proxy: { '/workbench': 'http://127.0.0.1:4174', '/api': 'http://127.0.0.1:4174' } },
});
