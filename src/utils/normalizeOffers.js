// Превращает вложенный ответ этапа 2 в плоский список предложений для таблицы.
//
// Ответ устроен так:
//   goods[]            — сама искомая деталь выбранного бренда
//     warehouses[]     — её предложения: склад, цена, наличие
//     analogues[]      — аналоги
//       warehouses[]   — предложения аналога
//
// Одна строка таблицы = одна деталь на одном складе.
// Цену и наличие берём из склада, а не из верхнего price детали.
const toOffers = (part, isOriginal) =>
    (part.warehouses ?? [])
        // Без цены или без остатка — купить нельзя, такое предложение не показываем
        .filter((warehouse) => warehouse.price > 0 && warehouse.stock > 0)
        .map((warehouse) => ({
            id: `${part.goodsID}-${warehouse.id}`,
            brand: part.brand.trim(),
            number: part.number?.trim() ?? '',
            name: part.name?.trim() || 'Без названия',
            warehouse: warehouse.code,
            price: warehouse.price,
            stock: warehouse.stock,
            isOriginal,
        }));

export const normalizeOffers = (goods = []) =>
    goods
        // Пустая структура — так API отвечает, если ничего не найдено
        .filter((part) => part?.brand?.trim())
        .flatMap((part) => [
            ...toOffers(part, true),
            ...(part.analogues ?? [])
                .filter((analogue) => analogue?.brand?.trim())
                .flatMap((analogue) => toOffers(analogue, false)),
        ]);
