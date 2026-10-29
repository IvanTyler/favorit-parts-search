import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        // API Favorit-Parts не отдаёт CORS-заголовки, поэтому запросы из браузера идут через прокси:
        // /api/hs/hsprice/... -> https://api.favorit-parts.ru/hs/hsprice/...
        proxy: {
            '/api': {
                target: 'https://api.favorit-parts.ru',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                // Bootstrap 5 ещё использует @import и старые функции Sass — глушим эти предупреждения
                silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
                quietDeps: true,
            },
        },
    },
});
