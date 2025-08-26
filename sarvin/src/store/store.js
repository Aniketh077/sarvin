import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import newsletterContactReducer from './slices/newsletterContactSlice';
import uploadReducer from './slices/uploadSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    admin: adminReducer,
    newsletterContact: newsletterContactReducer,
    upload: uploadReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});