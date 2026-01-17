const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
