import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { fetchAllOrders, updateOrderStatus } from '../../../store/slices/orderSlice';
import OrdersStatistics from './components/OrdersStatistics';
import OrdersFilters from './components/OrdersFilters';
import OrdersTable from './components/OrdersTable';
import OrdersPagination from './components/OrdersPagination';
import OrderDetails from './components/OrderDetails';

const AdminOrders = ({ initialOrderId }) => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderDetailsId, setOrderDetailsId] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Open order details if initialOrderId is provided
  useEffect(() => {
    if (initialOrderId) {
      setOrderDetailsId(initialOrderId);
    }
  }, [initialOrderId]);

  const ordersPerPage = 5;

  // Fetch orders on component mount
  useEffect(() => {
    if (user && user.token) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user]);

  // Helper function to get order status
  const getOrderStatus = (order) => {
    const status = order.status || order.orderStatus || 'processing';
    return status === 'pending' ? 'processing' : status;
  };

  // Helper function to get order total
  const getOrderTotal = (order) => {
    return order.total || order.totalPrice || order.totalAmount || 0;
  };

  // Filter orders based on search and status - Fixed search functionality
  const filteredOrders = orders.filter(order => {
    const orderStatus = getOrderStatus(order);
    const searchTerm = searchQuery.toLowerCase().trim();
    
    const matchesSearch = !searchTerm || 
      (order.orderId || '').toLowerCase().includes(searchTerm) ||
      (order._id || '').toLowerCase().includes(searchTerm) ||
      (order.user?.name || '').toLowerCase().includes(searchTerm) ||
      (order.user?.email || '').toLowerCase().includes(searchTerm) ||
      (order.shippingAddress?.fullName || '').toLowerCase().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Event handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewOrder = (id) => {
    setOrderDetailsId(id);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsId(null);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      dispatch(fetchAllOrders());
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="p-3 sm:p-4 md:p-6 flex justify-center items-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-[#2A4365]" />
          <span className="text-sm sm:text-base text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading orders
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-3">
                <Button
                  variant="outline"
                  onClick={() => dispatch(fetchAllOrders())}
                  className="text-red-700 border-red-300 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderDetails = orderDetailsId ? orders.find(order => order._id === orderDetailsId) : null;

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      {!orderDetails ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#2A4365]">Orders Management</h1>
            <Button 
              onClick={() => dispatch(fetchAllOrders())}
              disabled={loading}
              className="w-full sm:w-auto bg-[#2A4365] hover:bg-[#C87941] text-white text-sm px-3 py-2"
            >
              {loading ? 'Refreshing...' : 'Refresh Orders'}
            </Button>
          </div>

          <OrdersStatistics 
            orders={orders} 
            getOrderStatus={getOrderStatus}
            getOrderTotal={getOrderTotal}
          />
          
          <OrdersFilters 
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
          />
          
          <OrdersTable 
            orders={currentOrders}
            onViewOrder={handleViewOrder}
            getOrderStatus={getOrderStatus}
            getOrderTotal={getOrderTotal}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
          
          <OrdersPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            ordersPerPage={ordersPerPage}
            filteredOrders={filteredOrders}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <OrderDetails 
          order={orderDetails}
          onClose={handleCloseOrderDetails}
          onUpdateStatus={handleUpdateOrderStatus}
          statusUpdateLoading={statusUpdateLoading}
          getOrderStatus={getOrderStatus}
          getOrderTotal={getOrderTotal}
        />
      )}
    </div>
  );
};

export default AdminOrders;