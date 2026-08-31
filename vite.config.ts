import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Works with both the custom domain and GitHub Pages path
  base: "./",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
