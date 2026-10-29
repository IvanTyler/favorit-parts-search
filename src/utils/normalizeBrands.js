// Превращает «сырой» массив goods из API в список производителей для выбора.
// - отбрасывает пустые структуры (так API отвечает, если по артикулу ничего не найдено);
// - убирает повторы: один и тот же бренд может прийти несколько раз;
// - подставляет заглушку, если у детали нет названия.
export const normalizeBrands = (goods = []) => {
    const brands = new Map();

    goods.forEach((item) => {
        const brand = item?.brand?.trim();

        if (!brand || brands.has(brand)) return;

        brands.set(brand, {
            ...item,
            number: item.number?.trim() ?? '',
            name: item.name?.trim() || 'Без названия',
        });
    });


    return [...brands.values()];
};
