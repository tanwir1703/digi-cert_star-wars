import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/digi-cert_star-wars/',
  plugins: [react()],
});

