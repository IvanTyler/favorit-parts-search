import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { clsx } from 'clsx';
import { Preloader } from '../../UI/Preloader/Preloader';
import { EmptyState } from '../../UI/EmptyState/EmptyState';
import { ErrorMessage } from '../../UI/ErrorMessage/ErrorMessage';
import { AnaloguesTable } from '../AnaloguesTable/AnaloguesTable';
import style from './Analogues.module.scss';

// Правая колонка: данные берёт сама из store — их туда кладёт клик по бренду слева
export const Analogues = () => {
    const { query, analogues, isLoading, error } = useSelector((state) => state.analogues);
    const ref = useRef(null);

    const isPending = isLoading === 'pending';
    const isDone = isLoading === 'success' || isLoading === 'error';
    const hasData = analogues.length > 0;

    // На телефоне блок предложений ниже списка брендов — когда пришёл ответ,
    // плавно прокручиваем к нему с текущего места. На десктопе колонки рядом, прокрутка не нужна
    useEffect(() => {
        if (!isDone || !ref.current) return;
        if (window.matchMedia('(min-width: 992px)').matches) return;

        // getBoundingClientRect().top — расстояние от верха экрана, поэтому прибавляем,
        // на сколько страница уже прокручена. −16 — небольшой отступ сверху
        const positionSectionTop = Math.floor(
            ref.current.getBoundingClientRect().top + window.scrollY - 16,
        );

        window.scrollTo({
            top: positionSectionTop,
            behavior: 'smooth',
        });
    }, [isDone, query]);

    return (
        <section ref={ref}>
            <h2 className="h5 mb-3">
                Предложения
                {query && (
                    <span className="text-secondary fw-normal">
                        {' '}для {query.brand} {query.number}
                    </span>
                )}
            </h2>

            {isLoading === '' && (
                <EmptyState text="Выберите производителя, чтобы увидеть аналоги и цены" />
            )}

            {/* Первая загрузка — показывать пока нечего, просто прелоадер */}
            {isPending && !hasData && <Preloader />}

            {isLoading === 'error' && <ErrorMessage message={error} />}

            {isLoading === 'success' && !hasData && (
                <EmptyState text="Предложений в наличии нет" />
            )}

            {/* Пока грузится новый бренд, старая таблица остаётся на месте полупрозрачной,
                прелоадер поверх. Так страница не становится короче и не дёргается */}
            {hasData && (isPending || isLoading === 'success') && (
                <div className={clsx(style.result, isPending && style.result_loading)}>
                    <AnaloguesTable offers={analogues} />
                    {isPending && (
                        <div className={style.result__overlay}>
                            <Preloader />
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
