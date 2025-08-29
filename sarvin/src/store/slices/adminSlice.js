import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../api/AdminAPI';

// Thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await adminAPI.getDashboardStats(auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (params = {}, { getState, rejectWithValue }) => { 
    try {
      const { auth } = getState();
      return await adminAPI.getUsers(auth.user.token, params);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrdersForUser = createAsyncThunk(
  'admin/fetchOrdersForUser',
  async ({ userId, page, limit }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await adminAPI.getUserOrders(auth.user.token, userId, { page, limit });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  stats: null,
  users: [],
    selectedCustomerOrders: {
    orders: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0
    },
    lifetimeTotalSpent: 0 
  },
  ordersLoading: false,
  error: null,
   pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  },
  loading: false,
};

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
 reducers: {
    clearSelectedCustomerOrders: (state) => {
      state.selectedCustomerOrders = {
        orders: [],
        pagination: { currentPage: 1, totalPages: 1, totalOrders: 0 },
        lifetimeTotalSpent: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load dashboard stats';
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination.currentPage = action.payload.currentPage;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load users';
      })
     .addCase(fetchOrdersForUser.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(fetchOrdersForUser.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.selectedCustomerOrders = {
          orders: action.payload.orders,
          pagination: {
            currentPage: action.payload.currentPage,
            totalPages: action.payload.totalPages,
            totalOrders: action.payload.totalOrders
          },
          lifetimeTotalSpent: action.payload.lifetimeTotalSpent
        };
      })
      .addCase(fetchOrdersForUser.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload?.message || 'Failed to load customer orders';
      });
  }
});

export const { clearSelectedCustomerOrders } = adminSlice.actions;
export default adminSlice.reducer;
