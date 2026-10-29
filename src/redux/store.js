import { configureStore } from '@reduxjs/toolkit';
import brands from './slices/brandsSlice';
import analogues from './slices/analoguesSlice';

export const store = configureStore({
    reducer: {
        brands,
        analogues,
    },
});
