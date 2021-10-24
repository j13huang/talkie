import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = 3001;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "ui",
  clearScreen: false,
  server: {
    proxy: {
      "*": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      "/ws": {
        target: `ws://localhost:${PORT}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: `${__dirname}/dist`,
    emptyOutDir: true,
  },
});
