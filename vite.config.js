import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  // Remove explicit port to use Vite's default (5173). Keep `open` so the browser opens automatically.
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
