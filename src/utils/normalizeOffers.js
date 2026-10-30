// Превращает ответ этапа 2 в список строк для таблицы:
// сначала выбранная деталь, за ней её аналоги. Одна строка — одна деталь.
export const normalizeOffers = (goods = []) => {
    const part = goods[0];

    // Пустая структура — так API отвечает, если ничего не найдено
    if (!part?.brand?.trim()) return [];

    // Аналоги — по возрастанию цены, дешёвые сверху
    const analogues = [...(part.analogues ?? [])].sort((a, b) => a.price - b.price);

    return [part, ...analogues]
        // Без цены или без остатка купить нельзя — такие позиции не показываем
        .filter((item) => item.price > 0 && item.count > 0)
        .map((item) => {
            console.log('item', item)
            return ({
                id: item.goodsID,
                brand: item.brand.trim(),
                number: item.number?.trim() ?? '',
                name: item.name?.trim() || 'Без названия',
                price: item.price,
                stock: item.count,
                isOriginal: item === part,
            })
        }
        );
};
