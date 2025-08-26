import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadAPI } from '../../api/uploadAPI';

// Async Thunks
export const uploadSingleImage = createAsyncThunk(
  'upload/uploadSingle',
  async ({ file, folder = 'images', key = 'default' }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const result = await uploadAPI.uploadSingleImage(file, folder, auth.user.token);
      return { ...result, key };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to upload image' });
    }
  }
);

export const uploadMultipleImages = createAsyncThunk(
  'upload/uploadMultiple',
  async ({ files, folder = 'images' }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      
      // Initialize progress for each file
      files.forEach((file, index) => {
        dispatch(updateMultipleUploadProgress({ fileName: file.name, progress: 0 }));
      });
      
      // Simulate progress updates (you can replace this with actual progress from your API)
      const progressInterval = setInterval(() => {
        files.forEach((file) => {
          const currentProgress = getState().upload.multipleUploadProgress[file.name] || 0;
          if (currentProgress < 90) {
            dispatch(updateMultipleUploadProgress({ 
              fileName: file.name, 
              progress: Math.min(currentProgress + Math.random() * 20, 90) 
            }));
          }
        });
      }, 200);
      
      const result = await uploadAPI.uploadMultipleImages(files, folder, auth.user.token);
      
      clearInterval(progressInterval);
      
      // Set all files to 100% progress
      files.forEach((file) => {
        dispatch(updateMultipleUploadProgress({ fileName: file.name, progress: 100 }));
      });
      
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to upload images' });
    }
  }
);

export const deleteImage = createAsyncThunk(
  'upload/deleteImage',
  async (imageUrl, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await uploadAPI.deleteImage(imageUrl, auth.user.token);
      return imageUrl;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete image' });
    }
  }
);

const initialState = {
  uploading: {}, // Object to track individual uploads by key
  uploadProgress: {},
  uploadedImages: [],
  error: null,
  uploadingMultiple: false,
  multipleUploadProgress: {},
  deletingImage: false
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUploadState: (state) => {
      state.uploading = {};
      state.uploadingMultiple = false;
      state.uploadProgress = {};
      state.multipleUploadProgress = {};
      state.error = null;
    },
    updateUploadProgress: (state, action) => {
      const { key, progress } = action.payload;
      state.uploadProgress[key] = progress;
    },
    updateMultipleUploadProgress: (state, action) => {
      const { fileName, progress } = action.payload;
      state.multipleUploadProgress[fileName] = progress;
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
    },
    setUploadingState: (state, action) => {
      const { key, uploading } = action.payload;
      state.uploading[key] = uploading;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload single image
      .addCase(uploadSingleImage.pending, (state, action) => {
        const key = action.meta.arg.key || 'default';
        state.uploading[key] = true;
        state.error = null;
        state.uploadProgress[key] = 0;
      })
      .addCase(uploadSingleImage.fulfilled, (state, action) => {
        const key = action.payload.key;
        state.uploading[key] = false;
        state.uploadProgress[key] = 100;
        state.uploadedImages.push({
          id: Date.now(),
          url: action.payload.url,
          folder: action.payload.folder || 'images',
          uploadedAt: new Date().toISOString()
        });
      })
      .addCase(uploadSingleImage.rejected, (state, action) => {
        const key = action.meta.arg?.key || 'default';
        state.uploading[key] = false;
        state.uploadProgress[key] = 0;
        state.error = action.payload?.message || 'Failed to upload image';
      })

      // Upload multiple images
      .addCase(uploadMultipleImages.pending, (state) => {
        state.uploadingMultiple = true;
        state.error = null;
        // Don't reset progress here as it's set in the thunk
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        state.uploadingMultiple = false;
        
        // Add uploaded images to the state
        const newImages = action.payload.urls.map((url, index) => ({
          id: Date.now() + index,
          url,
          folder: action.payload.folder || 'images',
          uploadedAt: new Date().toISOString()
        }));
        
        state.uploadedImages.push(...newImages);
        
        // Clear progress after a short delay to show completion
        setTimeout(() => {
          state.multipleUploadProgress = {};
        }, 1000);
      })
      .addCase(uploadMultipleImages.rejected, (state, action) => {
        state.uploadingMultiple = false;
        state.multipleUploadProgress = {};
        state.error = action.payload?.message || 'Failed to upload images';
      })

      // Delete image
      .addCase(deleteImage.pending, (state) => {
        state.deletingImage = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.deletingImage = false;
        // Remove the deleted image from uploadedImages
        state.uploadedImages = state.uploadedImages.filter(
          img => img.url !== action.payload
        );
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.deletingImage = false;
        state.error = action.payload?.message || 'Failed to delete image';
      });
  }
});

export const { 
  clearError, 
  resetUploadState, 
  updateUploadProgress, 
  updateMultipleUploadProgress,
  clearUploadedImages,
  setUploadingState
} = uploadSlice.actions;

export default uploadSlice.reducer;