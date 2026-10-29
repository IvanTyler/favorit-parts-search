import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../initialState';

export const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        getBrandsLoading(state) {
            state.isLoading = 'pending';
            state.error = null;
        },
        getBrandsSuccess(state, action) {
            state.brands = action.payload;
            state.isLoading = 'success';
        },
        getBrandsError(state, action) {
            state.brands = [];
            state.isLoading = 'error';
            state.error = action.payload;
        },
        // Сброс к начальному состоянию — когда поле очищено или артикул слишком короткий
        resetBrands() {
            return initialState;
        },
    },
});

export default brandsSlice.reducer;
export const { getBrandsLoading, getBrandsSuccess, getBrandsError, resetBrands } = brandsSlice.actions;
