// Универсальный вывод списка: сам ничего не рисует, а вызывает renderItem для каждого элемента.
// key нужно ставить на элемент, который возвращает renderItem.
export function ListItems({ items, renderItem }) {
    return <>{
        items.map((item, index) => renderItem(item, index))
    }</>;
}
