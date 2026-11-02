import { describe, it, expect } from 'vitest';
import { normalizeOffers } from './normalizeOffers';

// Ответ API: выбранная деталь OSSCA и три аналога.
// goods.price намеренно absurdный — если код его подхватит, тесты упадут:
// по документации этот реквизит использовать нельзя, цена берётся из warehouses.
const goods = [
    {
        goodsID: 'ossca-1',
        brand: 'OSSCA',
        number: '01089',
        name: 'Стеклоподъемник задний левый',
        price: 999999,
        count: 50,
        warehouses: [
            { code: 'МС2', id: '1', own: true, price: 1055.54, stock: 20, shipmentDate: '2023-03-07T15:00:00' },
            { code: 'МС5', id: '2', own: false, price: 1120.0, stock: 30, shipmentDate: '2023-03-08T12:00:00' },
        ],
        analogues: [
            {
                goodsID: 'stellox-1',
                brand: 'STELLOX',
                number: '7550430SX',
                name: 'Стеклоподъемник',
                price: 999999,
                count: 208,
                warehouses: [{ code: 'МС1', id: '3', price: 762.74, stock: 208 }],
            },
            {
                goodsID: 'loro-1',
                brand: 'LORO',
                number: '130-053-111',
                name: 'Стеклоподъемник',
                price: 999999,
                count: 24,
                warehouses: [
                    { code: 'МС2', id: '1', price: 640.0, stock: 24 },
                    // склад без остатка — его цена учитываться не должна
                    { code: 'МС9', id: '9', price: 100.0, stock: 0 },
                ],
            },
            {
                goodsID: 'febi-1',
                brand: 'FEBI',
                number: '123',
                name: 'Стеклоподъемник',
                price: 999999,
                count: 0,
                warehouses: [{ code: 'МС3', id: '4', price: 500, stock: 0 }],
            },
        ],
    },
];

describe('normalizeOffers', () => {
    it('ставит выбранную деталь первой, а аналоги сортирует по цене', () => {
        const result = normalizeOffers(goods);

        expect(result.map((item) => item.brand)).toEqual(['OSSCA', 'LORO', 'STELLOX', 'FEBI']);
        expect(result.map((item) => item.isOriginal)).toEqual([true, false, false, false]);
    });

    it('берёт цену из склада, а не из goods.price', () => {
        const [selected] = normalizeOffers(goods);

        // самая дешёвая позиция среди складов с остатком: 1055.54, а не 999999
        expect(selected.price).toBe(1055.54);
        expect(selected.stock).toBe(50);
        expect(selected.warehouses).toBe(2);
    });

    it('игнорирует цену склада, где нет остатка', () => {
        const loro = normalizeOffers(goods).find((item) => item.brand === 'LORO');

        // 100 ₽ на складе с нулевым остатком не должны стать ценой позиции
        expect(loro.price).toBe(640);
    });

    it('оставляет позицию с нулевым остатком и отдаёт её с ценой склада', () => {
        const febi = normalizeOffers(goods).find((item) => item.brand === 'FEBI');

        expect(febi).toMatchObject({ stock: 0, price: 500, warehouses: 0 });
    });

    it('возвращает пустой массив, если ничего не найдено', () => {
        // Так API отвечает на неизвестный артикул: одна пустая структура
        expect(normalizeOffers([{ brand: '', number: '', name: '' }])).toEqual([]);
        // И на случай, если goods не пришёл вовсе
        expect(normalizeOffers()).toEqual([]);
    });

    it('не падает, если склады не пришли', () => {
        const [row] = normalizeOffers([{ goodsID: '1', brand: 'MEYLE', number: '1', count: 3 }]);

        expect(row.price).toBeNull();
        expect(row.warehouses).toBe(0);
    });
});
