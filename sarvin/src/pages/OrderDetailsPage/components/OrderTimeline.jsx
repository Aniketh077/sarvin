import React from "react";
import { Calendar, CheckCircle, Clock, Truck } from "lucide-react";

const OrderTimeline = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTimestamp = (status) => {
    const historyItem = order.statusHistory?.find(item => item.status === status);
    return historyItem ? historyItem.timestamp : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Order Timeline
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Order Placed</p>
              <p className="text-sm text-gray-600">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {getStatusTimestamp('processing') && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Order Processing
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(getStatusTimestamp('processing'))}
                </p>
              </div>
            </div>
          )}

          {getStatusTimestamp('shipped') && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Order Shipped
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(getStatusTimestamp('shipped'))}
                </p>
              </div>
            </div>
          )}

          {getStatusTimestamp('delivered') && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Order Delivered
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(getStatusTimestamp('delivered'))}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;