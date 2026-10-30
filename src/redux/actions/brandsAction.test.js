import { describe, it, expect, vi } from 'vitest';
import $api from '../../api/http';
import { brandsAction } from './brandsAction';
import { getBrandsLoading, getBrandsSuccess } from '../slices/brandsSlice';

// Подменяем модуль с axios: тест не ходит в настоящий API,
// а $api.get — заглушка, ответ которой мы задаём сами
vi.mock('../../api/http', () => ({
    default: { get: vi.fn() },
}));

describe('brandsAction', () => {
    it('запрашивает бренды по артикулу и кладёт в store нормализованный список', async () => {
        // 1. Готовим ответ сервера: в нём дубль OSSCA и пустая запись — их должна убрать нормализация
        $api.get.mockResolvedValue({
            data: {
                goods: [
                    { brand: 'OSSCA', number: '01089', name: 'Стеклоподъемник задний левый' },
                    { brand: 'OSSCA', number: '01089', name: 'Стеклоподъемник задний левый' },
                    { brand: '', number: '', name: '' },
                    { brand: 'FEBI', number: '01089', name: 'Антифриз' },
                ],
            },
        });

        // 2. dispatch — тоже заглушка: запоминает всё, что в неё передали
        const dispatch = vi.fn();

        // 3. Запускаем экшен так же, как это делает Redux
        await brandsAction('01089')(dispatch);

        // 4. Проверяем запрос: ушёл с правильным артикулом
        expect($api.get).toHaveBeenCalledWith('', {
            params: { number: '01089' },
            signal: expect.any(AbortSignal),
        });

        // 5. Проверяем, что ушло в store: сначала «загрузка», потом успех с чистым списком
        expect(dispatch).toHaveBeenNthCalledWith(1, getBrandsLoading());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            getBrandsSuccess([
                expect.objectContaining({ brand: 'OSSCA', name: 'Стеклоподъемник задний левый' }),
                expect.objectContaining({ brand: 'FEBI', name: 'Антифриз' }),
            ]),
        );
    });
});
