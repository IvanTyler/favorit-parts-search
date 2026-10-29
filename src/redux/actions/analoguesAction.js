import axios from 'axios';
import $api from '../../api/http';
import { getAnaloguesError, getAnaloguesLoading, getAnaloguesSuccess } from '../slices/analoguesSlice';
import { normalizeOffers } from '../../utils/normalizeOffers';

// Контроллер текущего запроса: если быстро кликнуть по другому бренду,
// старый запрос отменяется и его ответ не перезапишет свежий
let controller = null;

export const cancelAnaloguesRequest = () => {
    controller?.abort();
    controller = null;
};

// Этап 2: деталь выбранного бренда вместе с аналогами
export const analoguesAction = (number, brand) => async (dispatch) => {
    controller?.abort();
    controller = new AbortController();

    dispatch(getAnaloguesLoading({ number, brand }));

    try {
        const response = await $api.get('', {
            params: { number, brand, analogues: 'on' },
            signal: controller.signal,
        });

        if (response.data.error) {
            dispatch(getAnaloguesError(String(response.data.error)));
            return;
        }

        // Разворачиваем вложенный ответ в плоский список строк для таблицы
        dispatch(getAnaloguesSuccess(normalizeOffers(response.data.goods)));
    } catch (error) {
        if (axios.isCancel(error)) return;

        const apiError = error.response?.data?.error;
        if (apiError) {
            dispatch(getAnaloguesError(String(apiError)));
            return;
        }

        dispatch(getAnaloguesError('Не удалось получить данные. Проверьте подключение к интернету.'));
    }
};
