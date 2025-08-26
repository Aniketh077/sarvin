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
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await adminAPI.getUsers(auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  stats: null,
  users: [],
  loading: false,
  error: null
};

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
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
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load users';
      });
  }
});

export default adminSlice.reducer;
