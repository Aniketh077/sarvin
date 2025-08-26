import React from 'react';
import { ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';

const OrdersStatistics = ({ orders, getOrderStatus, getOrderTotal }) => {
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);
  const processingOrders = orders.filter(order => getOrderStatus(order) === 'processing').length;
  const completedOrders = orders.filter(order => getOrderStatus(order) === 'delivered').length;

  const statisticsData = [
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      bgColor: 'bg-[#2A4365]',
      textColor: 'text-[#2A4365]'
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Processing',
      value: processingOrders.toLocaleString(),
      icon: Clock,
      bgColor: 'bg-[#C87941]',
      textColor: 'text-[#C87941]'
    },
    {
      title: 'Completed',
      value: completedOrders.toLocaleString(),
      icon: CheckCircle,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {statisticsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{stat.title}</div>
                <div className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate" title={stat.value}>
                  {stat.value}
                </div>
              </div>
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 ${stat.bgColor} rounded-full flex items-center justify-center ml-2`}>
                <IconComponent className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersStatistics;