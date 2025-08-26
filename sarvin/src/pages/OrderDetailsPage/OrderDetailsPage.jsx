import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2, AlertCircle, Package } from "lucide-react";
import Button from "../../components/ui/Button";
import { fetchOrderDetails, resetOrder } from "../../store/slices/orderSlice";
import { rateProduct } from "../../store/slices/productSlice";
import { useToast } from "../../contexts/ToastContext";
import OrderHeader from "./components/OrderHeader";
import OrderItems from "./components/OrderItems";
import ShippingAddress from "./components/ShippingAddress";
import OrderTimeline from "./components/OrderTimeline";
import OrderSummary from "./components/OrderSummary";
import PaymentInfo from "./components/PaymentInfo";
import OrderActions from "./components/OrderActions";
import RatingModal from "./components/RatingModal";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { order, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (user && orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch, orderId, user]);

  const handleRateProduct = async (productId, ratingData) => {
    try {
      await dispatch(
        rateProduct({
          productId,
          ratingData: {
            ...ratingData,
            orderId: order._id,
          },
        })
      ).unwrap();
      
      setShowRatingModal(false);
      setSelectedProduct(null);
      showSuccess("Review submitted successfully!");
      
      // Refresh the order details to get updated review status
      dispatch(fetchOrderDetails(orderId));
    } catch (error) {
      console.error("Rating failed:", error);
      showError(error.message || "Failed to submit review. Please try again.");
    }
  };

  const handleTrackOrder = () => {
    console.log("Track order:", order._id);
    // showInfo("Tracking functionality coming soon!");
  };

  const handleCompletePayment = () => {
    // Add payment functionality
    console.log("Complete payment:", order._id);
    showInfo("Redirecting to payment...");
  };

  // Updated to handle individual product reviews
  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
  };

  const handleDownloadInvoice = () => {
    console.log("Download invoice for order:", order.orderId);
    showInfo("Downloading invoice...");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4365]" />
              <span className="ml-3 text-lg">Loading order details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Order Not Found
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => navigate("/orders")}>
                  Back to Orders
                </Button>
                <Button
                  variant="primary"
                  onClick={() => dispatch(fetchOrderDetails(orderId))}
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

  if (!order) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Order Found
              </h2>
              <Link to="/orders">
                <Button variant="primary">Back to Orders</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/orders"
              className="inline-flex items-center text-[#2A4365] hover:text-[#C87941] mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
            <OrderHeader order={order} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <OrderItems 
                items={order.items} 
                orderStatus={order.orderStatus}
                onWriteReview={handleWriteReview}
                orderId={order._id}
              />
              <ShippingAddress address={order.shippingAddress} />
              <OrderTimeline order={order} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <OrderSummary order={order} />
              <PaymentInfo order={order} />
              <OrderActions
                order={order}
                onTrackOrder={handleTrackOrder}
                onCompletePayment={handleCompletePayment}
                onDownloadInvoice={handleDownloadInvoice}
              />
            </div>
          </div>
        </div>
      </div>

      {showRatingModal && selectedProduct && (
        <RatingModal
          product={selectedProduct}
          onSubmit={handleRateProduct}
          onCancel={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;