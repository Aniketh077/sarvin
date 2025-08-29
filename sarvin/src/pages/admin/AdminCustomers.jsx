import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Mail, Phone, ChevronLeft, ChevronRight, Loader2, User, Eye, Package } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { fetchAllUsers, fetchOrdersForUser, clearSelectedCustomerOrders } from '../../store/slices/adminSlice';

// A reusable Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-between items-center mt-6">
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline">
        <ChevronLeft size={16} className="mr-2" /> Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline">
        Next <ChevronRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

const AdminCustomers = ({ onViewOrder }) => {
  const dispatch = useDispatch();

  const {
    users,
    pagination: userPagination,
    loading: usersLoading,
    selectedCustomerOrders,
    ordersLoading,
  } = useSelector((state) => state.admin);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerPage, setCustomerPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  
  const CUSTOMERS_PER_PAGE = 8;
  const ORDERS_PER_PAGE = 5;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCustomerPage(1);
      dispatch(fetchAllUsers({ page: 1, limit: CUSTOMERS_PER_PAGE, search: searchQuery }));
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery, dispatch]);

  useEffect(() => {
    dispatch(fetchAllUsers({ page: customerPage, limit: CUSTOMERS_PER_PAGE, search: searchQuery }));
  }, [customerPage, dispatch]);

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(fetchOrdersForUser({ 
        userId: selectedCustomer._id, 
        page: orderPage, 
        limit: ORDERS_PER_PAGE 
      }));
    }
  }, [selectedCustomer, orderPage, dispatch]);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOrderPage(1);
  };
  
  const handleCloseCustomerDetails = () => {
    setSelectedCustomer(null);
    dispatch(clearSelectedCustomerOrders());
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;
    
    const { orders, pagination: orderPagination, lifetimeTotalSpent } = selectedCustomerOrders;

    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center mb-6">
          <button onClick={handleCloseCustomerDetails} className="mr-4 p-2 text-gray-600 hover:text-[#2A4365] hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
            <p className="text-sm text-gray-600 mt-1">Full profile and order history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-[#2A4365] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500">Joined on {formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex items-center">
                  <Mail size={14} className="text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 break-all">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phoneNumber && (
                  <div className="flex items-center">
                    <Phone size={14} className="text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{selectedCustomer.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-bold text-md mb-4">Lifetime Stats</h3>
              <div className="space-y-3">
                  <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Orders</span>
                      <span className="font-semibold text-gray-800">{orderPagination?.totalOrders || 0}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      {/* ⭐️ FIX: Use the lifetimeTotalSpent from Redux state */}
                      <span className="font-semibold text-green-600">₹{lifetimeTotalSpent.toFixed(2)}</span>
                  </div>
              </div>
            </div>
          </div>

          {/* Order History Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-bold text-md mb-4">Order History</h3>
            {ordersLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={32} className="animate-spin text-[#2A4365]" />
              </div>
            ) : orders && orders.length > 0 ? (
              <>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order._id} 
                      className="border rounded-md p-4 transition-shadow hover:shadow-md cursor-pointer"
                      onClick={() => onViewOrder(order._id)} 
                    >
                       <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm text-[#2A4365]">Order #{order.orderId}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-gray-800">₹{order.total.toFixed(2)}</p>
                             <p className="text-xs capitalize mt-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700">{order.orderStatus}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
                <Pagination 
                  currentPage={orderPage}
                  totalPages={orderPagination?.totalPages || 1}
                  onPageChange={setOrderPage}
                />
              </>
            ) : (
              <div className="text-center py-16 flex flex-col items-center">
                <Package size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No orders found for this customer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerList = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-sm text-gray-600 mt-1">View, search, and manage customer information</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
          <div className="text-xs text-gray-500">Total Customers</div>
          <div className="text-lg font-semibold text-[#2A4365]">{userPagination.totalUsers}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={20} className="text-gray-400" />}
          fullWidth
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined On</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#2A4365] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">{customer.email}</div>
                     <div className="text-sm text-gray-500">{customer.phoneNumber || 'N/A'}</div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                      leftIcon={<Eye size={16} />}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Pagination 
        currentPage={customerPage}
        totalPages={userPagination.totalPages}
        onPageChange={setCustomerPage}
      />
    </>
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {selectedCustomer ? renderCustomerDetails() : renderCustomerList()}
    </div>
  );
};

export default AdminCustomers;