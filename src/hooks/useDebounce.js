import { useEffect, useState } from 'react';

// Возвращает значение с задержкой: обновляется только когда value не менялось delay мс.
// Нужен, чтобы не отправлять запрос на каждую введённую букву.
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);

        // Если value изменилось раньше, чем прошла задержка, — отменяем предыдущий таймер
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};
