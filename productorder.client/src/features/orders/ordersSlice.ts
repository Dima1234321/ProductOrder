import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrders, type Order } from '../../services/api';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', getOrders);

interface OrdersState {
    items: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    status: 'idle',
    error: null
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unable to load orders.';
            });
    }
});

export default ordersSlice.reducer;
