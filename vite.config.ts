import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const workbench = `http://127.0.0.1:${process.env.GIZA_PORT || 4174}`;

export default defineConfig({
  plugins: [react()],
  server: { port: 4173, proxy: { '/workbench': workbench, '/api': workbench } },
  preview: { port: 4173, proxy: { '/workbench': workbench, '/api': workbench } },
});
