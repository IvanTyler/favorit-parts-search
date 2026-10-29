import axios from 'axios';

// Общий экземпляр axios: базовый адрес (через прокси Vite) и ключ подставляются во все запросы
const $api = axios.create({
    baseURL: '/api/hs/hsprice/',
    params: {
        key: import.meta.env.VITE_API_KEY,
    },
});

export default $api;
