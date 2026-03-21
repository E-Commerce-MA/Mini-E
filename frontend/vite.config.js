import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const rawProxyTarget = env.VITE_PROXY_TARGET || env.VITE_API_URL || "http://localhost:8080";
  const proxyTarget = rawProxyTarget.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
