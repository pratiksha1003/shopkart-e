import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk('products/list', async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
});

export const fetchProduct = createAsyncThunk('products/detail', async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
});

export const fetchCategories = createAsyncThunk('products/categories', async () => {
  const { data } = await api.get('/categories?main=true');
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    categories: [],
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.products = a.payload.products;
        s.page = a.payload.page;
        s.pages = a.payload.pages;
        s.total = a.payload.total;
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(fetchProduct.pending, (s) => { s.loading = true; })
      .addCase(fetchProduct.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
