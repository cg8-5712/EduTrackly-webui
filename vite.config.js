import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const proxyTarget =
    env.VITE_API_BASE_URL ||
    env.VITE_API_URL ||
    "http://192.168.101.138/es/api/v2"

  return defineConfig({
    base: env.VITE_BASE_PATH || "/",
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: env.VITE_PORT,
      open: true,
      cors: true,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
      __DEFAULT_LOCALE__: JSON.stringify(env.VITE_DEFAULT_LOCALE),
    },
  })
}
