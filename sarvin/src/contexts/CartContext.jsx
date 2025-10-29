import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
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
    synced: false,
};

// Helper to get consistent product ID
const getProductId = (product) => {
    return product._id || product.id;
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
                synced: action.payload.synced || false,
                loading: false,
                error: null,
            };
        case 'CLEAR_CART':
            return { ...initialState, loading: false, isGuest: state.isGuest };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, initialState);
    const { isAuthenticated, user } = useAuth();
    const { showSuccess, showError } = useToast();
    const syncInProgressRef = useRef(false);
    const hasSyncedRef = useRef(false);

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
            if (!guestCartJson) return { items: [] };
            
            const parsed = JSON.parse(guestCartJson);
            // Ensure items is an array
            return { items: Array.isArray(parsed.items) ? parsed.items : [] };
        } catch (error) {
            console.error('Failed to parse guest cart:', error);
            localStorage.removeItem(GUEST_CART_KEY);
            return { items: [] };
        }
    }, []);

    const saveGuestCart = useCallback((items) => {
        const newState = calculateCartState(items);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newState));
        dispatch({ type: 'SET_CART', payload: { ...newState, isGuest: true, synced: false } });
    }, []);

    // --- AUTH CART ACTIONS ---
    const fetchUserCart = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const data = await apiCall('/cart');
            const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
            dispatch({ 
                type: 'SET_CART', 
                payload: { 
                    items: data.items,
                    subtotal: data.subtotal,
                    itemCount, 
                    isGuest: false,
                    synced: true
                } 
            });
        } catch (error) {
            console.error('Fetch cart error:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    }, []);

    const syncCart = useCallback(async () => {
        // Prevent multiple simultaneous syncs
        if (syncInProgressRef.current || hasSyncedRef.current) {
            return;
        }

        syncInProgressRef.current = true;

        try {
            const guestCart = getGuestCart();
            
            // If no guest cart items, just fetch the user's existing cart
            if (!guestCart.items || guestCart.items.length === 0) {
                await fetchUserCart();
                hasSyncedRef.current = true;
                return;
            }

            // Prepare items for sync - deduplicate on client side first
            const itemsMap = new Map();
            guestCart.items.forEach(item => {
                const productId = getProductId(item.product);
                if (itemsMap.has(productId)) {
                    itemsMap.get(productId).quantity += item.quantity;
                } else {
                    itemsMap.set(productId, {
                        productId: productId,
                        quantity: item.quantity
                    });
                }
            });

            const itemsToSync = Array.from(itemsMap.values());

            showSuccess("Syncing your cart...", { duration: 1500 });
            
            const finalCart = await apiCall('/cart/sync', {
                method: 'POST',
                body: JSON.stringify({ items: itemsToSync }),
            });
            
            // Clear guest cart after successful sync
            localStorage.removeItem(GUEST_CART_KEY);
            
            // Calculate total quantity
            const totalQuantity = finalCart.items.reduce((sum, item) => sum + item.quantity, 0);
            
            dispatch({ 
                type: 'SET_CART', 
                payload: { 
                    items: finalCart.items,
                    subtotal: finalCart.subtotal,
                    itemCount: totalQuantity,
                    isGuest: false,
                    synced: true
                } 
            });

            hasSyncedRef.current = true;

        } catch (error) {
            console.error('Failed to sync cart:', error);
            showError('Could not sync cart. Loading your saved items...');
            // Fallback to user's existing cart
            await fetchUserCart();
            hasSyncedRef.current = true;
        } finally {
            syncInProgressRef.current = false;
        }
    }, [getGuestCart, showError, showSuccess, fetchUserCart]);


    // --- UNIVERSAL CART ACTIONS ---

    const addToCart = async (product, quantity = 1) => {
        const productId = getProductId(product);
        
        if (isAuthenticated) {
            try {
                await apiCall('/cart', {
                    method: 'POST',
                    body: JSON.stringify({ productId, quantity }),
                });
                await fetchUserCart();
                showSuccess(`${product.name} added to cart!`);
            } catch (error) {
                showError(error.message || 'Failed to add item to cart.');
                throw error;
            }
        } else {
            const guestCart = getGuestCart();
            const existingItemIndex = guestCart.items.findIndex(
                item => getProductId(item.product) === productId
            );
            
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
            const itemIndex = guestCart.items.findIndex(
                item => getProductId(item.product) === productId
            );
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
            guestCart.items = guestCart.items.filter(
                item => getProductId(item.product) !== productId
            );
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
            if (isAuthenticated && user) {
                // Only sync once per session when user logs in
                if (!hasSyncedRef.current) {
                    dispatch({ type: 'SET_LOADING', payload: true });
                    await syncCart();
                }
            } else {
                // Reset sync flags when logged out
                hasSyncedRef.current = false;
                syncInProgressRef.current = false;
                
                const guestCart = getGuestCart();
                const newState = calculateCartState(guestCart.items);
                dispatch({ type: 'SET_CART', payload: { ...newState, isGuest: true, synced: false } });
            }
        };
        
        initializeCart();
    }, [isAuthenticated, user?.id]);

    // Helper functions
    const isInCart = (productId) => 
        cart.items.some(item => getProductId(item.product) === productId);
    
    const getItemQuantity = (productId) => {
        const item = cart.items.find(item => getProductId(item.product) === productId);
        return item ? item.quantity : 0;
    };
    
    const getCartSummary = () => {
        const subtotal = cart.subtotal;
        const shipping = 0;
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