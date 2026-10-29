import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { brandsAction, cancelBrandsRequest } from '../../../redux/actions/brandsAction';
import { resetBrands } from '../../../redux/slices/brandsSlice';
import { analoguesAction, cancelAnaloguesRequest } from '../../../redux/actions/analoguesAction';
import { resetAnalogues } from '../../../redux/slices/analoguesSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import { SearchInput } from '../../UI/SearchInput/SearchInput';
import { Preloader } from '../../UI/Preloader/Preloader';
import { EmptyState } from '../../UI/EmptyState/EmptyState';
import { ErrorMessage } from '../../UI/ErrorMessage/ErrorMessage';
import { BrandList } from '../BrandList/BrandList';

export const PartSearch = () => {
    const [number, setNumber] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const dispatch = useDispatch();

    const { brands, isLoading, error } = useSelector((state) => state.brands);

    // Запрос уходит через 500 мс после того, как пользователь перестал печатать
    const debouncedNumber = useDebounce(number.trim(), 500);

    useEffect(() => {
        // Новый артикул — старый выбор бренда и его аналоги больше не актуальны
        setSelectedBrand(null);
        cancelAnaloguesRequest();
        dispatch(resetAnalogues());

        // Пустое поле — запрос не отправляем (API ответит «Empty number goods!»), возвращаем подсказку
        if (!debouncedNumber) {
            // Сначала отменяем запрос в пути, иначе его ответ придёт после сброса и снова покажет список
            cancelBrandsRequest();
            dispatch(resetBrands());
            return;
        }

        dispatch(brandsAction(debouncedNumber));
    }, [debouncedNumber]);

    // Этап 2: клик по бренду — запрашиваем деталь этого бренда с аналогами
    const handleSelectBrand = (brand) => {
        setSelectedBrand(brand);
        dispatch(analoguesAction(debouncedNumber, brand));
    };

    return (
        <section className="mb-4">
            <h2 className="h5 mb-3">1. Введите артикул детали</h2>
            <SearchInput
                value={number}
                onChange={setNumber}
                placeholder="Например, 01089"
            />

            <h2 className="h5 mt-4 mb-3">2. Выберите производителя</h2>

            {isLoading === '' && (
                <EmptyState text="Введите артикул детали" />
            )}

            {isLoading === 'pending' && <Preloader />}

            {isLoading === 'error' && <ErrorMessage message={error} />}

            {isLoading === 'success' && brands.length === 0 && (
                <EmptyState text="По этому артикулу ничего не найдено" />
            )}

            {isLoading === 'success' && brands.length > 0 && (
                <BrandList
                    brands={brands}
                    selectedBrand={selectedBrand}
                    onSelect={handleSelectBrand}
                />
            )}
        </section>
    );
};
