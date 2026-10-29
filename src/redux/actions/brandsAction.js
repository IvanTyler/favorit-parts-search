import axios from 'axios';
import $api from '../../api/http';
import { getBrandsError, getBrandsLoading, getBrandsSuccess } from '../slices/brandsSlice';
import { normalizeBrands } from '../../utils/normalizeBrands';

// Контроллер текущего запроса: при новом поиске отменяем предыдущий,
// чтобы поздний ответ на старый артикул не перезаписал свежий результат
let controller = null;

// Отменить запрос, который ещё в пути (например, пользователь стёр артикул до 1–2 символов)
export const cancelBrandsRequest = () => {
    controller?.abort();
    controller = null;
};

// Этап 1: запрос всех деталей с указанным артикулом (в ответе есть производители)
export const brandsAction = (number) => async (dispatch) => {
    controller?.abort();
    controller = new AbortController();

    dispatch(getBrandsLoading());

    try {
        const response = await $api.get('', {
            params: { number },
            signal: controller.signal,
        });

        // При ошибке API возвращает объект с полем error, например «Invalid key client!»
        if (response.data.error) {
            dispatch(getBrandsError(String(response.data.error)));
            return;
        }

        // Убираем пустые записи и дубли брендов — в store кладём уже готовый список
        dispatch(getBrandsSuccess(normalizeBrands(response.data.goods)));
    } catch (error) {
        // Отменённый запрос — это не ошибка: его заменил более новый
        if (axios.isCancel(error)) return;

        // Сервер ответил ошибкой (например, 403 «Request quota exceeded!») — показываем его текст
        const apiError = error.response?.data?.error;
        if (apiError) {
            dispatch(getBrandsError(String(apiError)));
            return;
        }

        // Ответа нет совсем — проблема с сетью
        dispatch(getBrandsError('Не удалось получить данные. Проверьте подключение к интернету.'));
    }
};
