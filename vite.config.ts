import { nodePolyfills } from "vite-plugin-node-polyfills";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills(),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: "debug",
        onProxyReq: function (proxyReq, req, res) {
          proxyReq.setHeader("Content-Length", req.body.length);
        },
      },
    },
  },
});