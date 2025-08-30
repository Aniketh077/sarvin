import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Truck, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { fetchMyOrders } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'processing':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getProductImage = (item) => {
    if (!item || !item.product) return '/placeholder-image.jpg';
    if (item.product.image) return item.product.image;
    if (item.product.images && item.product.images.length > 0) return item.product.images[0];
    return '/placeholder-image.jpg';
  };

  const getProductName = (item) => {
    if (!item || !item.product) return 'Product Unavailable';
    return item.product.name || 'Product Name';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200  p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                variant="primary"
                onClick={() => dispatch(fetchMyOrders())}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="bg-white  shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link to="/products">
                <Button variant="primary">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id}
                  className="bg-white  shadow-sm overflow-hidden transition-shadow duration-200">
                  <div className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/orders/${order._id}`)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Order</span>
                          <span className="ml-2 font-medium">#{order.orderId}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="ml-1 capitalize">{order.orderStatus}</span>
                          </span>
                        </div>
                        <div className="text-sm font-medium mt-1">
                          Total: ₹{order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    {order.items && order.items.map((item, index) => {
                      // If product data is missing, render a fallback UI that is NOT clickable
                      if (!item.product) {
                        return (
                          <div key={`${order._id}-${index}`} className="flex items-center py-4 border-b border-gray-100 last:border-0">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rder-gray-200 bg-gray-100 flex items-center justify-center">
                              <AlertCircle className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="ml-6 flex-1">
                              <h3 className="text-sm font-medium text-red-600">
                                Product Unavailable
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">This product may have been removed.</p>
                            </div>
                          </div>
                        );
                      }

                      // Otherwise, render the product as normal, with a clickable image
                      return (
                        <div key={item.product._id} className="flex items-center py-4 border-b border-gray-100 last:border-0">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rder-gray-200">
                            <img
                              src={getProductImage(item)}
                              alt={getProductName(item)}
                              className="h-full w-full object-contain cursor-pointer"
                              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                              onClick={() => navigate(`/product/${item.product._id}`)}
                            />
                          </div>
                          <div className="ml-6 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">
                                {getProductName(item)}
                              </h3>
                              <p className="text-sm font-medium">₹{(item.price || 0).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity || 0}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <div className="flex space-x-3">
                      {order.paymentStatus === 'pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            console.log('Complete payment:', order._id);
                          }}
                        >
                          Complete Payment
                        </Button>
                      )}
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-[#2A4365] hover:text-[#C87941] text-sm font-medium inline-flex items-center"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;