import { createSlice } from '@reduxjs/toolkit';
import { analoguesInitialState } from '../initialState';

export const analoguesSlice = createSlice({
    name: 'analogues',
    initialState: analoguesInitialState,
    reducers: {
        getAnaloguesLoading(state, action) {
            state.query = action.payload;
            state.isLoading = 'pending';
            state.error = null;
        },
        getAnaloguesSuccess(state, action) {
            state.analogues = action.payload;
            state.isLoading = 'success';
        },
        getAnaloguesError(state, action) {
            state.analogues = [];
            state.isLoading = 'error';
            state.error = action.payload;
        },
        // Сброс — когда меняется артикул и выбранный бренд уже неактуален
        resetAnalogues() {
            return analoguesInitialState;
        },
    },
});

export default analoguesSlice.reducer;
export const { getAnaloguesLoading, getAnaloguesSuccess, getAnaloguesError, resetAnalogues } =
    analoguesSlice.actions;
