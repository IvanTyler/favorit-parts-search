import { useSelector } from 'react-redux';
import { Preloader } from '../../UI/Preloader/Preloader';
import { EmptyState } from '../../UI/EmptyState/EmptyState';
import { ErrorMessage } from '../../UI/ErrorMessage/ErrorMessage';
import { AnaloguesTable } from '../AnaloguesTable/AnaloguesTable';

// Правая колонка: данные берёт сама из store — их туда кладёт клик по бренду слева
export const Analogues = () => {
    const { query, analogues, isLoading, error } = useSelector((state) => state.analogues);

    console.log('analogues', analogues)
    return (
        <section>
            <h2 className="h5 mb-3">
                3. Аналоги и предложения
                {query && (
                    <span className="text-secondary fw-normal">
                        {' '}— {query.brand} {query.number}
                    </span>
                )}
            </h2>

            {isLoading === '' && (
                <EmptyState text="Выберите производителя, чтобы увидеть аналоги и цены" />
            )}

            {isLoading === 'pending' && <Preloader />}

            {isLoading === 'error' && <ErrorMessage message={error} />}

            {isLoading === 'success' && analogues.length === 0 && (
                <EmptyState text="Предложений в наличии нет" />
            )}

            {isLoading === 'success' && analogues.length > 0 && (
                <AnaloguesTable offers={analogues} />
            )}
        </section>
    );
};
