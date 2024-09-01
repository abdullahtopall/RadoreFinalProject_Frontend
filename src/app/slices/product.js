import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import Swal from "sweetalert2";

// API URL'sini uygun şekilde güncelleyin
const API_BASE_URL = "https://localhost:44390";

// Thunks for async actions
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data.result;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data.result;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
});

// Slice
const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        carts: [],
        favorites: [],
        single: null,
        status: 'idle',
        error: null
    },
    reducers: {
        AddToCart: (state, action) => {
            let { id } = action.payload;
            let sepeteEklenecekUrun = state.carts.find(item => item.id === parseInt(id));
            if (sepeteEklenecekUrun === undefined) {
                let item = state.products.find(item => item.id === parseInt(id));
                item.quantity = 1;
                state.carts.push(item);
                Swal.fire({
                    title: 'Başarılı',
                    text: "Ürün sepete eklendi!",
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        },
        updateCart: (state, action) => {
            let { val, id } = action.payload;
            state.carts.forEach(item => {
                if (item.id === parseInt(id)) {
                    item.quantity = val;
                }
            });
        },
        removeCart: (state, action) => {
            let { id } = action.payload;
            state.carts = state.carts.filter(item => item.id !== parseInt(id));
        },
        clearCart: (state) => {
            state.carts = [];
        },
        addToFavorites: (state, action) => {
            let { id } = action.payload;
            let item = state.favorites.find(item => item.id === parseInt(id));
            if (item === undefined) {
                let urunFavori = state.products.find(item => item.id === parseInt(id));
                urunFavori.quantity = 1;
                state.favorites.push(urunFavori);
                Swal.fire({
                    title: 'Başarılı',
                    text: 'İlgili ürün favorilere eklenmiştir',
                    icon: 'success'
                });
            } else {
                Swal.fire('Başarsız', 'İlgili ürün favorilere eklenemedi', 'warning');
            }
        },
        removeToFav: (state, action) => {
            let { id } = action.payload;
            state.favorites = state.favorites.filter(item => item.id !== parseInt(id));
        },
        clearFav: (state) => {
            state.favorites = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.single = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { AddToCart, updateCart, removeCart, clearCart, addToFavorites, removeToFav, clearFav } = productsSlice.actions;

export default productsSlice.reducer;
