import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../api/productAPI';

// --- Helper to ensure consistent data shape ---
const normalizeItem = (item) => ({
  ...item,
  id: item._id ? item._id.toString() : item.id,
});

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async () => {
    const data = await productAPI.getFeaturedProducts();
    return data;
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async () => {
    const data = await productAPI.getNewArrivals();
    return data;
  }
);

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await productAPI.getProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// export const fetchProducts = createAsyncThunk(
//   'products/fetchAll',
//   async (params, { rejectWithValue }) => {
//     try {
//       return await productAPI.getProducts(params);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
//     }
//   }
// );

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await productAPI.getProductById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch product details' });
    }
  }
);

export const fetchTypes = createAsyncThunk(
  'products/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      return await productAPI.getTypes();
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch types' });
    }
  }
);

export const createNewType = createAsyncThunk(
  'products/createType',
  async (typeData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await productAPI.createType(typeData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create type' });
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  'products/fetchBestSellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getBestSellers();
      return response;
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch best sellers' });
    }
  }
);

// Other thunks remain the same
export const rateProduct = createAsyncThunk(
  'products/rate',
  async ({ productId, ratingData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await productAPI.rateProduct(productId, ratingData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to rate product' });
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await productAPI.createProduct(productData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create product' });
    }
  }
);

export const updateExistingType = createAsyncThunk(
  'products/updatetype',
  async ({ id, typeData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await productAPI.updateType(id, typeData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update type' });
    }
  }
);

export const deleteType = createAsyncThunk(
  'products/deleteType', 
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await productAPI.deleteType(id, auth.user.token); 
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete type' });
    }
  }
);

export const fetchCollections = createAsyncThunk(
  'products/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      return await productAPI.getCollections();
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch collections' });
    }
  }
);

export const updateExistingProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await productAPI.updateProduct(id, productData, auth.user.token);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update product' });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await productAPI.deleteProduct(id, auth.user.token);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete product' });
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  newArrivals: [], 
  product: null,
  collections: [],
  types: [],
  bestSellers: [],
  loading: false,
  bestSellersLoading: false,
  error: null,
  bestSellersError: null,
  totalPages: 1,
  currentPage: 1
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearBestSellersError: (state) => {
      state.bestSellersError = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
       .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle new arrivals
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load products';
        state.products = [];
      })
       .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load collections';
      })
      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Product not found';
      })

      // Fetch types
      .addCase(fetchTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload.map(normalizeItem);
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load types';
      })

      // Fetch best sellers - separate loading state
      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellersLoading = true;
        state.bestSellersError = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
  state.bestSellersLoading = false;
  state.bestSellers = action.payload.map(item => ({
    ...item,
    images: item.images?.length ? item.images : [item.image || '/placeholder-image.jpg']
  }));
})
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellersError = action.payload?.message || 'Failed to load best sellers';
      })

      .addCase(createNewType.fulfilled, (state, action) => {
        state.types.push(normalizeItem(action.payload));
      })
      
      .addCase(updateExistingType.fulfilled, (state, action) => {
        const updatedType = normalizeItem(action.payload);
        const index = state.types.findIndex(t => t.id === updatedType.id);
        if (index !== -1) {
          state.types[index] = updatedType;
        }
      })

      // Delete type
      .addCase(deleteType.fulfilled, (state, action) => {
        state.types = state.types.filter(t => t.id !== action.payload);
      })

      // Admin: Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create product';
      })

      // Admin: Update product
      .addCase(updateExistingProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.product?._id === action.payload._id) {
          state.product = action.payload;
        }
      })
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update product';
      })

      // Rate product
      .addCase(rateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(rateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to rate product';
      })

      // Admin: Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete product';
      });
  }
});

export const { clearBestSellersError, clearError } = productSlice.actions;
export default productSlice.reducer;