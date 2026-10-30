import { clsx } from 'clsx';
import { ListItems } from '../../List/ListItems';
import style from './AnaloguesTable.module.scss';

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
});

const COLUMNS_COUNT = 5;

// Одна строка — одна деталь: производитель, артикул, название, остаток, цена
const renderRow = (offer) => (
    <tr key={offer.id}>
        <td className="text-nowrap">{offer.brand}</td>
        <td className={clsx('text-nowrap', style.analoguesTable__number)}>{offer.number}</td>
        <td>{offer.name}</td>
        <td className="text-end text-nowrap">{offer.stock} шт.</td>
        <td className={clsx('text-end text-nowrap', style.analoguesTable__price)}>
            {priceFormatter.format(offer.price)}
        </td>
    </tr>
);

// Заголовок раздела — строка с одной ячейкой на всю ширину
const SectionRow = ({ title }) => (
    <tr className={style.analoguesTable__section}>
        <th colSpan={COLUMNS_COUNT} scope="rowgroup">{title}</th>
    </tr>
);

// Этап 2: выбранная деталь и её аналоги, разделённые заголовками
export const AnaloguesTable = ({ offers }) => {
    const selected = offers.filter((offer) => offer.isOriginal);
    const analogues = offers.filter((offer) => !offer.isOriginal);

    return (
        <div className={clsx('table-responsive', style.analoguesTable)}>
            <table className="table table-hover align-middle mb-0">
                <thead>
                    <tr className="text-nowrap">
                        <th scope="col">Производитель</th>
                        <th scope="col">Артикул</th>
                        <th scope="col">Наименование</th>
                        <th scope="col" className="text-end">В наличии</th>
                        <th scope="col" className="text-end">Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {selected.length > 0 && (
                        <>
                            <SectionRow title="Выбранная деталь" />
                            <ListItems items={selected} renderItem={renderRow} />
                        </>
                    )}

                    <SectionRow title={`Аналоги · ${analogues.length}`} />
                    {analogues.length > 0 ? (
                        <ListItems items={analogues} renderItem={renderRow} />
                    ) : (
                        <tr>
                            <td colSpan={COLUMNS_COUNT} className="text-secondary">
                                Аналогов в наличии нет
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
