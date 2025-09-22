import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal Vite config for debugging
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    hmr: false, // Completely disable HMR
  },
  build: {
    outDir: "dist",
  },
});
