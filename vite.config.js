import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default ({ mode }) => {
    // 加载 .env 文件
    const env = loadEnv(mode, process.cwd());

    return defineConfig({
        base: env.VITE_BASE_PATH || '/',
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: env.VITE_PORT,
            open: true,
            cors: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        define: {
            __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
            __DEFAULT_LOCALE__: JSON.stringify(env.VITE_DEFAULT_LOCALE),
        },
    });
};
