import axios from 'axios';

// Тестовый ключ из примеров официальной документации. Нужен, чтобы проект запускался
// одной командой `npm run dev`: без него API отвечает «Empty key!».
// Свой ключ кладётся в `.env` как VITE_API_KEY — он важнее значения ниже.
const DEMO_KEY = '00000000-0000-0000-0000-000000000001';

// Общий экземпляр axios: базовый адрес (через прокси Vite) и ключ подставляются во все запросы
const $api = axios.create({
    baseURL: '/api/hs/hsprice/',
    params: {
        key: import.meta.env.VITE_API_KEY || DEMO_KEY,
    },
});

export default $api;
