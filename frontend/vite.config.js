import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/clientes": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/agentes": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/automoveis": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/pedidos": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/contratos": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
});
