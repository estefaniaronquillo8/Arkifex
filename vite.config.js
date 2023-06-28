import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRefresh from "@vitejs/plugin-react-refresh";
import moment from 'moment-timezone';

// https://vitejs.dev/config/
export default defineConfig({

  define: {
    'process.env': {
      TIMEZONE: JSON.stringify('America/New_York'),
    },
  },
  
  plugins: [react(), reactRefresh()],
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
});