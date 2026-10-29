import style from './SearchInput.module.scss';

// Поле поиска. Ничего не знает про API — только отдаёт введённое значение наружу.
export const SearchInput = ({ value, onChange, placeholder = 'Введите значение', disabled = false }) => {
    return (
        <div className={style.searchInput}>
            <input
                type="search"
                className="form-control"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                disabled={disabled}
            />
        </div>
    );
};
