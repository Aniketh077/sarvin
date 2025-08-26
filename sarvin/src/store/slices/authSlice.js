import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/authAPI';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      return await authAPI.login(userData);
    } catch (error) {
      console.error('Login API error:', error);
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authAPI.register(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.user || !auth.user.token) {
        return rejectWithValue({ message: 'No token available' });
      }
      return await authAPI.getMe(auth.user.token);
    } catch (error) {
      // If token is invalid, logout user
      if (error.response?.status === 401) {
        authAPI.logout();
        return rejectWithValue({ message: 'Session expired' });
      }
      return rejectWithValue(error.response?.data || { message: 'Failed to get user' });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.user || !auth.user.token) {
        return rejectWithValue({ message: 'No token available' });
      }
      return await authAPI.updateProfile(userData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      return await authAPI.verifyEmail(token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (email, { rejectWithValue }) => {
    try {
      return await authAPI.resendVerificationEmail(email);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Resend failed' });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      return await authAPI.forgotPassword(email);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Forgot password failed' });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      return await authAPI.resetPassword(token, newPassword);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Reset password failed' });
    }
  }
);

const storedUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: storedUser || null,
  isAuthenticated: !!storedUser,
  isAdmin: storedUser?.role === 'admin' || false,
  isLoading: false,
  error: null,
  successMessage: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authAPI.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    sessionExpired: (state) => {
      authAPI.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = 'Session expired. Please login again.';
      state.successMessage = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.successMessage = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.error = null;
        state.successMessage = action.payload.message || 'Registration successful! Please check your email to verify your account.';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.successMessage = null;
      })
      
      // Get user profile
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update user data but keep the token
        state.user = { ...state.user, ...action.payload };
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin';
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        
        if (action.payload?.message === 'Session expired') {
          state.user = null;
          state.isAuthenticated = false;
          state.isAdmin = false;
        }
        
        state.error = action.payload?.message || 'Failed to load user';
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === 'admin';
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      
      // Email verification
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || 'Email verified successfully!';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Email verification failed';
      })
      
      // Resend verification
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || 'Verification email resent successfully!';
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to resend verification email';
      })
      
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || 'Password reset email sent successfully!';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send password reset email';
      })
      
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || 'Password reset successfully!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to reset password';
      });
  }
});

export const { logout, clearError, clearSuccessMessage, sessionExpired, setError, setSuccessMessage } = authSlice.actions;

export default authSlice.reducer;