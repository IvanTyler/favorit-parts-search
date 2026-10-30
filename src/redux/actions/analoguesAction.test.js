import { describe, it, expect, vi, beforeEach } from 'vitest';
import $api from '../../api/http';
import { analoguesAction } from './analoguesAction';
import { getAnaloguesError, getAnaloguesLoading, getAnaloguesSuccess } from '../slices/analoguesSlice';

// Подменяем axios-инстанс: в настоящий API тест не ходит
vi.mock('../../api/http', () => ({
    default: { get: vi.fn() },
}));

describe('analoguesAction', () => {
    // Перед каждым тестом сбрасываем заглушку, чтобы вызовы одного теста не попали в другой
    beforeEach(() => {
        $api.get.mockReset();
    });

    it('запрашивает аналоги по артикулу и бренду и кладёт в store готовые строки', async () => {
        $api.get.mockResolvedValue({
            data: {
                goods: [
                    {
                        goodsID: 'ossca-1',
                        brand: 'OSSCA',
                        number: '01089',
                        name: 'Стеклоподъемник задний левый',
                        price: 1055.54,
                        count: 50,
                        analogues: [
                            { goodsID: 'loro-1', brand: 'LORO', number: '130-053-111', name: 'Стеклоподъемник', price: 597.86, count: 24 },
                        ],
                    },
                ],
            },
        });
        const dispatch = vi.fn();

        await analoguesAction('01089', 'OSSCA')(dispatch);

        // Запрос ушёл с артикулом, брендом и флагом аналогов
        expect($api.get).toHaveBeenCalledWith('', {
            params: { number: '01089', brand: 'OSSCA', analogues: 'on' },
            signal: expect.any(AbortSignal),
        });

        // Сначала загрузка — с запомненным запросом (для заголовка «Предложения для …»)
        expect(dispatch).toHaveBeenNthCalledWith(1, getAnaloguesLoading({ number: '01089', brand: 'OSSCA' }));

        // Потом успех: выбранная деталь и её аналог
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            getAnaloguesSuccess([
                expect.objectContaining({ brand: 'OSSCA', isOriginal: true }),
                expect.objectContaining({ brand: 'LORO', isOriginal: false }),
            ]),
        );
    });

    it('показывает текст ошибки от сервера', async () => {
        // Сервер ответил, но с ошибкой — например, кончилась квота демо-ключа
        $api.get.mockRejectedValue({
            response: { data: { error: 'Request quota exceeded!' } },
        });
        const dispatch = vi.fn();

        await analoguesAction('010', 'OSSCA')(dispatch);

        expect(dispatch).toHaveBeenLastCalledWith(getAnaloguesError('Request quota exceeded!'));
    });

    it('сообщает о проблеме с сетью, если ответа нет совсем', async () => {
        $api.get.mockRejectedValue(new Error('Network Error'));
        const dispatch = vi.fn();

        await analoguesAction('01089', 'OSSCA')(dispatch);

        expect(dispatch).toHaveBeenLastCalledWith(
            getAnaloguesError('Не удалось получить данные. Проверьте подключение к интернету.'),
        );
    });
});
