import { describe, it, expect } from 'vitest';
import { normalizeOffers } from './normalizeOffers';

// Небольшой ответ API: выбранная деталь OSSCA и три её аналога
const goods = [
    {
        goodsID: 'ossca-1',
        brand: 'OSSCA',
        number: '01089',
        name: 'Стеклоподъемник задний левый',
        price: 1055.54,
        count: 50,
        analogues: [
            { goodsID: 'stellox-1', brand: 'STELLOX', number: '7550430SX', name: 'Стеклоподъемник', price: 762.74, count: 208 },
            { goodsID: 'loro-1', brand: 'LORO', number: '130-053-111', name: 'Стеклоподъемник', price: 597.86, count: 24 },
            // Нет в наличии — должен отфильтроваться
            { goodsID: 'febi-1', brand: 'FEBI', number: '123', name: 'Стеклоподъемник', price: 500, count: 0 },
        ],
    },
];

describe('normalizeOffers', () => {
    it('ставит выбранную деталь первой, а аналоги сортирует по цене', () => {
        const result = normalizeOffers(goods);

        // map берёт из каждой строки только бренд — так удобно проверить порядок
        expect(result.map((item) => item.brand)).toEqual(['OSSCA', 'LORO', 'STELLOX']);

        // Только первая строка помечена как выбранная
        expect(result.map((item) => item.isOriginal)).toEqual([true, false, false]);
    });

    it('превращает деталь в строку таблицы с нужными полями', () => {
        const [selected] = normalizeOffers(goods);

        expect(selected).toEqual({
            id: 'ossca-1',
            brand: 'OSSCA',
            number: '01089',
            name: 'Стеклоподъемник задний левый',
            price: 1055.54,
            stock: 50, // остаток берётся из count
            isOriginal: true,
        });
    });

    it('отбрасывает позиции без остатка', () => {
        const result = normalizeOffers(goods);

        expect(result.find((item) => item.brand === 'FEBI')).toBeUndefined();
    });

    it('возвращает пустой массив, если ничего не найдено', () => {
        // Так API отвечает на неизвестный артикул: одна пустая структура
        expect(normalizeOffers([{ brand: '', number: '', name: '' }])).toEqual([]);
        // И на случай, если goods не пришёл вовсе
        expect(normalizeOffers()).toEqual([]);
    });
});
