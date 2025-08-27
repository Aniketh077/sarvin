import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../api/orderAPI';

// Async Thunks
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await orderAPI.createOrder(orderData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await orderAPI.getOrderById(id, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await orderAPI.getMyOrders(auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const payOrder = createAsyncThunk(
  'orders/pay',
  async ({ id, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await orderAPI.updateOrderToPaid(id, paymentResult, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin actions
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async ({ page, limit, search, status } = {}, { getState, rejectWithValue }) => { 
    try {
      const { auth } = getState();
      return await orderAPI.getOrders(auth.user.token, { page, limit, search, status });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await orderAPI.updateOrderStatus(id, status, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
  successPay: false,
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.successPay = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create order';
      })
      
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Order not found';
      })
      
      // Fetch user orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load orders';
      })
      
      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.successPay = true;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update payment';
      })
      
      // Admin: Fetch all orders
     .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load orders';
      })

      
      // Admin: Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.order?._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update order';
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;