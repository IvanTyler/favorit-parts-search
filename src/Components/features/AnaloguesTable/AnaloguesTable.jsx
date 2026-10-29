import { clsx } from 'clsx';
import { ListItems } from '../../List/ListItems';
import style from './AnaloguesTable.module.scss';

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
});

// Этап 2: таблица предложений — искомая деталь и её аналоги по складам
export const AnaloguesTable = ({ offers }) => {
    return (
        <div className={clsx('table-responsive', style.analoguesTable)}>
            <table className="table table-hover align-middle mb-0">
                <thead>
                    <tr className="text-nowrap">
                        <th scope="col">Бренд</th>
                        <th scope="col">Артикул</th>
                        <th scope="col">Наименование</th>
                        <th scope="col">Склад</th>
                        <th scope="col" className="text-end">Цена</th>
                        <th scope="col" className="text-end">Наличие на складе, шт.</th>
                    </tr>
                </thead>
                <tbody>
                    <ListItems
                        items={offers}
                        renderItem={(offer) => (
                            <tr key={offer.id}>
                                <td className="fw-semibold text-nowrap">
                                    {offer.brand}
                                    {offer.isOriginal && (
                                        <span className="badge text-bg-primary ms-2">Выбранная</span>
                                    )}
                                </td>
                                <td className="text-nowrap">{offer.number}</td>
                                <td>{offer.name}</td>
                                <td className="text-nowrap">{offer.warehouse}</td>
                                <td className="text-end text-nowrap">
                                    {priceFormatter.format(offer.price)}
                                </td>
                                <td className="text-end">{offer.stock}</td>
                            </tr>
                        )}
                    />
                </tbody>
            </table>
        </div>
    );
};
