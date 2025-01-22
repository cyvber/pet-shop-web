import { configureStore } from '@reduxjs/toolkit';

// Import your slices (e.g., productSlice) here when created
import shopreducer from './ShopSlice';

const store = configureStore({
    reducer: {
        shop: shopreducer, // Add reducers here
    },
});

export default store;
