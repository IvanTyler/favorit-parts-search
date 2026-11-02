import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API Favorit-Parts не отдаёт CORS-заголовки, поэтому запросы из браузера идут через прокси.
// Один и тот же прокси нужен и dev-серверу, и preview: без него собранное приложение
// будет стучаться в /api и получать 404
const proxy = {
    '/api': {
        target: 'https://api.favorit-parts.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
    },
};

export default defineConfig({
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
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
