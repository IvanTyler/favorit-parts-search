import { clsx } from 'clsx';
import { ListItems } from '../../List/ListItems';
import style from './BrandList.module.scss';

// Этап 1: список производителей, найденных по артикулу
export const BrandList = ({ brands, selectedBrand, onSelect }) => {
    
    return (
        <ul className={clsx('list-group', style.brandList)}>
            <ListItems
                items={brands}
                renderItem={(item) => (
                    <li key={item.brand}>
                        <button
                            type="button"
                            className={clsx(
                                'list-group-item list-group-item-action',
                                item.brand === selectedBrand && 'active',
                            )}
                            onClick={() => onSelect(item.brand)}
                        >
                            <span className={style.brandList__brand}>{item.brand}</span>
                            <span className={style.brandList__name}>{item.name}</span>
                        </button>
                    </li>
                )}
            />
        </ul>
    );
};
