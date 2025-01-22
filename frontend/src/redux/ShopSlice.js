import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    brands: [],
    loading: false,
    error: null,
};

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setBrands: (state, action) => {
            state.brands = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setProducts, setBrands, setLoading, setError } = shopSlice.actions;

export const fetchShopData = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const API_URL = process.env.REACT_APP_API_URL;

        const [productResponse, brandResponse] = await Promise.all([
            fetch(`${API_URL}/api/products/allproducts`),
            fetch(`${API_URL}/api/brands/allbrands`),
        ]);

        const products = await productResponse.json();
        const brands = await brandResponse.json();

        dispatch(setProducts(products));
        dispatch(setBrands(brands));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export default shopSlice.reducer;
