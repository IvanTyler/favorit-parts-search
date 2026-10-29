export const initialState = {
    brands: [],
    isLoading: '', // '' | 'pending' | 'success' | 'error'
    error: null,
};

// Этап 2: аналоги выбранной детали
export const analoguesInitialState = {
    query: null, // { number, brand } — для какой детали показаны аналоги
    analogues: [],
    isLoading: '', // '' | 'pending' | 'success' | 'error'
    error: null,
};
