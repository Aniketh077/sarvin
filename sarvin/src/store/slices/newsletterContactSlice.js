import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsletterContactAPI } from '../../api/newsletterContactAPI';

// Async actions
export const subscribeNewsletter = createAsyncThunk(
  'newsletterContact/subscribeNewsletter',
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await newsletterContactAPI.subscribeNewsletter({ email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const submitContactForm = createAsyncThunk(
  'newsletterContact/submitContactForm',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await newsletterContactAPI.submitContactForm(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getSubscribers = createAsyncThunk(
  'newsletterContact/getSubscribers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await newsletterContactAPI.getSubscribers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getContactSubmissions = createAsyncThunk(
  'newsletterContact/getContactSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await newsletterContactAPI.getContactSubmissions();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateContactSubmission = createAsyncThunk(
  'newsletterContact/updateContactSubmission',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const data = await newsletterContactAPI.updateContactSubmission(id, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteContactSubmission = createAsyncThunk(
  'newsletterContact/deleteContactSubmission',
  async (id, { rejectWithValue }) => {
    try {
      const data = await newsletterContactAPI.deleteContactSubmission(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Slice
const newsletterContactSlice = createSlice({
  name: 'newsletterContact',
  initialState: {
    newsletterSubscribing: false,
    newsletterSubscribed: false,
    newsletterError: null,
    subscribers: [],

    contactSubmitting: false,
    contactSubmitted: false,
    contactError: null,
    contactSubmissions: [],

    loadingSubscribers: false,
    loadingSubmissions: false,
  },
  reducers: {
    resetNewsletterState: (state) => {
      state.newsletterSubscribing = false;
      state.newsletterSubscribed = false;
      state.newsletterError = null;
    },
    resetContactState: (state) => {
      state.contactSubmitting = false;
      state.contactSubmitted = false;
      state.contactError = null;
    },
    clearErrors: (state) => {
      state.newsletterError = null;
      state.contactError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Newsletter subscription
      .addCase(subscribeNewsletter.pending, (state) => {
        state.newsletterSubscribing = true;
        state.newsletterError = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.newsletterSubscribing = false;
        state.newsletterSubscribed = true;
        state.newsletterError = null;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.newsletterSubscribing = false;
        state.newsletterSubscribed = false;
        state.newsletterError = action.payload;
      })

      // Contact form submission
      .addCase(submitContactForm.pending, (state) => {
        state.contactSubmitting = true;
        state.contactError = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.contactSubmitting = false;
        state.contactSubmitted = true;
        state.contactError = null;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.contactSubmitting = false;
        state.contactSubmitted = false;
        state.contactError = action.payload;
      })

      // Get subscribers
      .addCase(getSubscribers.pending, (state) => {
        state.loadingSubscribers = true;
      })
      .addCase(getSubscribers.fulfilled, (state, action) => {
        state.loadingSubscribers = false;
        state.subscribers = action.payload.subscribers;
      })
      .addCase(getSubscribers.rejected, (state, action) => {
        state.loadingSubscribers = false;
        state.newsletterError = action.payload;
      })

      // Get contact submissions
      .addCase(getContactSubmissions.pending, (state) => {
        state.loadingSubmissions = true;
      })
      .addCase(getContactSubmissions.fulfilled, (state, action) => {
        state.loadingSubmissions = false;
        state.contactSubmissions = action.payload.submissions;
      })
      .addCase(getContactSubmissions.rejected, (state, action) => {
        state.loadingSubmissions = false;
        state.contactError = action.payload;
      });
  }
});

export const { resetNewsletterState, resetContactState, clearErrors } = newsletterContactSlice.actions;
export default newsletterContactSlice.reducer;
