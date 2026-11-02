// Превращает ответ этапа 2 в список строк для таблицы:
// сначала выбранная деталь, за ней её аналоги. Одна строка — одна деталь.
//
// ВАЖНО: goods.price по документации API использовать нельзя — «реквизит остался
// для совместимости, цену нужно брать из конкретного склада». Поэтому цена считается
// по массиву warehouses: берём самую дешёвую позицию среди складов, где товар есть.
// Если ни на одном складе остатка нет — показываем минимальную цену склада и помечаем
// позицию как «нет в наличии».
const getEffectivePrice = (item) => {
    const warehouses = (item?.warehouses ?? []).filter((warehouse) => Number(warehouse.price) > 0);

    if (!warehouses.length) return null;

    const inStock = warehouses.filter((warehouse) => Number(warehouse.stock) > 0);
    const pool = inStock.length > 0 ? inStock : warehouses;

    return Math.min(...pool.map((warehouse) => Number(warehouse.price)));
};

// Сколько складов реально готовы отгрузить — из этого получается «от N ₽»
const getWarehousesCount = (item) =>
    new Set(
        (item?.warehouses ?? [])
            .filter((warehouse) => Number(warehouse.stock) > 0)
            .map((warehouse) => warehouse.code || warehouse.id),
    ).size;

const toRow = (item, part) => {
    const price = getEffectivePrice(item);
    const stock = Number(item.count) || 0;

    return {
        id: item.goodsID,
        brand: item.brand.trim(),
        number: item.number?.trim() ?? '',
        name: item.name?.trim() || 'Без названия',
        price,
        stock,
        warehouses: getWarehousesCount(item),
        isOriginal: item === part,
    };
};

// Сначала то, что есть на складе; внутри группы — дешёвые сверху.
// Позиции без цены уезжают в конец
const byPrice = (a, b) => {
    const inStock = (item) => ((Number(item.count) || 0) > 0 ? 0 : 1);
    const priceOf = (item) => getEffectivePrice(item) ?? Infinity;

    return inStock(a) - inStock(b) || priceOf(a) - priceOf(b);
};

export const normalizeOffers = (goods = []) => {
    const part = goods[0];

    // Пустая структура — так API отвечает, если ничего не найдено
    if (!part?.brand?.trim()) return [];

    const analogues = [...(part.analogues ?? [])].sort(byPrice);

    // Позиции с нулевым остатком не выбрасываем: докуменация отдельно оговаривает,
    // что такая позиция приходит и её надо уметь показать — помечаем её в таблице
    return [part, ...analogues]
        .filter((item) => item?.brand?.trim())
        .map((item) => toRow(item, part));
};
