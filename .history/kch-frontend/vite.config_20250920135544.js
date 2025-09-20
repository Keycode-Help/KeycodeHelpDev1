import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    base: "/",
    build: {
      outDir: "dist",
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    // Ensure proper SPA routing
    server: {
      historyApiFallback: true,
      // Increase header size limits to handle large base64 image URLs
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      // Configure proxy for development server
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          secure: false,
        },
      },
      // Increase request header size limit
      middlewareMode: false,
      hmr: {
        port: 24678,
        // Prevent excessive reloads
        overlay: true,
      },
      // Watch options to prevent excessive file watching
      watch: {
        usePolling: false,
        interval: 1000,
        ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
      },
    },
    // Define global constants
    define: {
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      // Ensure NODE_ENV is properly defined
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
  };
});
