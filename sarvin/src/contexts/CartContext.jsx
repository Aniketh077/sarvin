import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(undefined);

const GUEST_CART_KEY = 'guestCart';

const initialState = {
    items: [],
    subtotal: 0,
    itemCount: 0,
    loading: true,
    error: null,
    isGuest: true, 
};

// Helper to calculate totals from an items array
const calculateCartState = (items = []) => {
    const subtotal = items.reduce((total, item) => {
        const price = item.product.discountPrice ?? item.product.price ?? 0;
        return total + price * item.quantity;
    }, 0);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    return { items, subtotal, itemCount };
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_CART':
            return {
                ...state,
                items: action.payload.items || [],
                subtotal: action.payload.subtotal || 0,
                itemCount: action.payload.itemCount || 0,
                isGuest: action.payload.isGuest,
                loading: false,
                error: null,
            };
        case 'CLEAR_CART':
            // Reset to initial but keep loading false and respect current auth state
            return { ...initialState, loading: false, isGuest: state.isGuest };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, initialState);
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError } = useToast();

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
        ? `${import.meta.env.VITE_BACKEND_URL}/api`
        : 'http://localhost:5000/api';

    const getAuthToken = () => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser).token : null;
    };
    
    const apiCall = async (endpoint, options = {}) => {
        const token = getAuthToken();
        if (!token) throw new Error('Authentication token not found.');
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'An API error occurred');
        return data;
    };

    // --- GUEST CART HELPERS ---
    const getGuestCart = useCallback(() => {
        try {
            const guestCartJson = localStorage.getItem(GUEST_CART_KEY);
            return guestCartJson ? JSON.parse(guestCartJson) : { items: [] };
        } catch (error) {
            console.error('Failed to parse guest cart:', error);
            localStorage.removeItem(GUEST_CART_KEY); // Clear corrupted data
            return { items: [] };
        }
    }, []);

    const saveGuestCart = useCallback((items) => {
        const newState = calculateCartState(items);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newState));
        dispatch({ type: 'SET_CART', payload: { ...newState, isGuest: true } });
    }, []);

    // --- AUTH CART ACTIONS ---
    const fetchUserCart = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const data = await apiCall('/cart');
            const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
            dispatch({ type: 'SET_CART', payload: { ...data, itemCount, isGuest: false } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    }, []);

    const syncCart = useCallback(async () => {
        const guestCart = getGuestCart();
        if (!guestCart || guestCart.items.length === 0) {
            await fetchUserCart();
            return;
        }

        showSuccess("Syncing your saved items...", { duration: 2000 });
        try {
            const finalCart = await apiCall('/cart/sync', {
                method: 'POST',
                body: JSON.stringify({
                    items: guestCart.items.map(item => ({
                        productId: item.product._id,
                        quantity: item.quantity,
                    })),
                }),
            });
            localStorage.removeItem(GUEST_CART_KEY);
            
            // Dispatch the final cart state returned from the sync endpoint
            const itemCount = finalCart.items.reduce((sum, item) => sum + item.quantity, 0);
            dispatch({ type: 'SET_CART', payload: { ...finalCart, itemCount, isGuest: false } });

        } catch (error) {
            console.error('Failed to sync cart:', error);
            showError('Could not sync local cart. Please contact support.');
            // Still fetch the user's original cart
            await fetchUserCart();
        }
    },[getGuestCart, showError, showSuccess, fetchUserCart]); 


    // --- UNIVERSAL CART ACTIONS (Handles both guest and auth) ---

    const addToCart = async (product, quantity = 1) => {
        dispatch({ type: 'CLEAR_ERROR' });
        if (isAuthenticated) {
            try {
                await apiCall('/cart', {
                    method: 'POST',
                    body: JSON.stringify({ productId: product._id, quantity }),
                });
                await fetchUserCart(); // Refresh cart from server
                showSuccess(`${product.name} added to cart!`);
            } catch (error) {
                showError(error.message || 'Failed to add item to cart.');
                throw error;
            }
        } else {
            const guestCart = getGuestCart();
            const existingItemIndex = guestCart.items.findIndex(item => item.product._id === product._id);
            if (existingItemIndex > -1) {
                guestCart.items[existingItemIndex].quantity += quantity;
            } else {
                guestCart.items.push({ product, quantity });
            }
            saveGuestCart(guestCart.items);
            showSuccess(`${product.name} added to cart!`);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        
        if (isAuthenticated) {
            try {
                await apiCall(`/cart/${productId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ quantity }),
                });
                await fetchUserCart();
            } catch (error) {
                showError(error.message || 'Failed to update quantity.');
            }
        } else {
            const guestCart = getGuestCart();
            const itemIndex = guestCart.items.findIndex(item => item.product._id === productId);
            if (itemIndex > -1) {
                guestCart.items[itemIndex].quantity = quantity;
                saveGuestCart(guestCart.items);
            }
        }
    };

    const removeFromCart = async (productId) => {
        if (isAuthenticated) {
            try {
                await apiCall(`/cart/${productId}`, { method: 'DELETE' });
                await fetchUserCart();
            } catch (error) {
                showError(error.message || 'Failed to remove item.');
            }
        } else {
            let guestCart = getGuestCart();
            guestCart.items = guestCart.items.filter(item => item.product._id !== productId);
            saveGuestCart(guestCart.items);
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await apiCall('/cart', { method: 'DELETE' });
                dispatch({ type: 'CLEAR_CART' });
            } catch (error) {
                showError(error.message || 'Failed to clear cart.');
            }
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
            dispatch({ type: 'CLEAR_CART' });
        }
    };

    // --- MAIN EFFECT: Handles authentication state changes ---
    useEffect(() => {
        const initializeCart = async () => {
            if (isAuthenticated) {
                dispatch({ type: 'SET_LOADING', payload: true });
                // This will now handle both syncing and fetching correctly.
                await syncCart(); 
            } else {
                // This part for guests remains the same.
                const guestCart = getGuestCart();
                const newState = calculateCartState(guestCart.items);
                dispatch({ type: 'SET_CART', payload: { ...newState, isGuest: true } });
            }
        };
        initializeCart();
    }, [isAuthenticated, syncCart]);
    // Helper functions
    const isInCart = (productId) => cart.items.some(item => (item.product._id || item.product.id) === productId);
    const getItemQuantity = (productId) => {
        const item = cart.items.find(item => (item.product._id || item.product.id) === productId);
        return item ? item.quantity : 0;
    };
    const getCartSummary = () => {
        const subtotal = cart.subtotal;
        const shipping = 0; // Assuming free shipping as in your code
        const total = subtotal + shipping;
        return { subtotal, shipping, total, itemCount: cart.itemCount };
    };

    const value = {
        cart,
        loading: cart.loading,
        error: cart.error,
        isGuest: cart.isGuest,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        getCartSummary,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};