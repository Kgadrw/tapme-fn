import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    // *.localhost subdomains (me.localhost, profile.localhost, etc.)
    allowedHosts: [".localhost", "localhost"],
    hmr: {
      clientPort: 8080,
    },
    watch: {
      // Avoid restarts (and stale HMR tokens) when editing admin/backend.
      ignored: ["**/admin/**", "**/backend/**", "**/dist/**"],
    },
    proxy: {
      "^/api/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
