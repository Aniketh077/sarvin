import React, { useState , useEffect} from 'react';
import { ChevronLeft, Loader2, Package, User, MapPin, CreditCard, FileText, Mail, Printer, Download,ChevronDown, Check,X } from 'lucide-react';

const OrderDetails = ({ order, onClose, onUpdateStatus, statusUpdateLoading}) => {
  const getOrderStatus = (ord) => ord?.orderStatus || 'processing';
  const getOrderTotal = (ord) => ord?.total || 0;

  const [selectedStatus, setSelectedStatus] = useState(getOrderStatus(order));
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Get frontend URL from environment variables
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL ;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Invalid Date';
    const date = new Date(dateInput);
    if (isNaN(date)) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProductName = (item) => {
    if (item.name) return item.name;
    if (item.productName) return item.productName;
    if (item.title) return item.title;
    if (item.product && typeof item.product === 'object' && item.product !== null) {
      if (item.product.name) return item.product.name;
      if (item.product.title) return item.product.title;
      if (item.product.productName) return item.product.productName;
    }
    if (item.product && typeof item.product === 'string') {
      return `Product ID: ${item.product}`;
    }
    return 'Product Name Not Available';
  };

  const getProductImage = (item) => {
    if (item.image) return item.image;
    if (item.product && typeof item.product === 'object' && item.product !== null) {
      if (item.product.image) return item.product.image;
      if (item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
        return item.product.images[0];
      }
    }
    return null;
  };

  // Get product ID for navigation
  const getProductId = (item) => {
    if (item.productId) return item.productId;
    if (item.product && typeof item.product === 'object' && item.product !== null) {
      return item.product._id || item.product.id;
    }
    if (item.product && typeof item.product === 'string') {
      return item.product;
    }
    return null;
  };

  // Handle product image click navigation
  const handleProductImageClick = (item) => {
    const productId = getProductId(item);
    if (productId && frontendUrl) {
      const productUrl = `${frontendUrl}/product/${productId}`;
      window.open(productUrl, '_blank');
    }
  };

  const calculateGSTFromTotal = (totalPrice) => {
    return (totalPrice * 18) / 118;
  };

  const calculateBasePrice = (totalPrice) => {
    return totalPrice - calculateGSTFromTotal(totalPrice);
  };

  const calculateTotals = () => {
    const items = order.orderItems || order.items || [];
    let totalQuantity = 0;
    let totalBasePrice = 0;
    let totalGST = 0;
    let totalAmount = 0;

    items.forEach(item => {
      const quantity = item.quantity || item.qty || 1;
      const itemTotal = (item.price || 0) * quantity;
      const itemGST = calculateGSTFromTotal(itemTotal);
      const itemBase = calculateBasePrice(itemTotal);

      totalQuantity += quantity;
      totalBasePrice += itemBase;
      totalGST += itemGST;
      totalAmount += itemTotal;
    });

    return { totalQuantity, totalBasePrice, totalGST, totalAmount };
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    if (newStatus !== getOrderStatus(order)) {
      onUpdateStatus(order._id, newStatus);
    }
  };

  const handlePrintOrder = () => {
    const printWindow = window.open('', '_blank');
    const orderInfo = {
      orderId: order.orderId || order._id.slice(-8),
      date: formatDate(order.createdAt),
      customer: order.user?.name || order.shippingAddress?.fullName || 'N/A',
      email: order.user?.email || 'N/A',
      phone: order.shippingAddress?.phone || order.user?.phone || 'N/A',
      paymentStatus: order.isPaid || order.paymentStatus === 'completed' ? 'Paid' : 'Not Paid',
      paymentMethod: order.paymentMethod || 'N/A',
      status: getOrderStatus(order),
      address: order.shippingAddress
    };

    const totals = calculateTotals();
    const items = order.orderItems || order.items || [];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Details - #${orderInfo.orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              padding: 30px; 
              color: #333; 
              line-height: 1.6;
            }
            .print-header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #2A4365;
              padding-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 30px;
            }
            .company-logo {
              width: 80px;
              height: 80px;
              object-fit: contain;
            }
            .company-info {
              text-align: center;
            }
            .print-header h1 { 
              color: #2A4365; 
              font-size: 32px; 
              margin-bottom: 5px;
            }
            .print-header h2 { 
              color: #C87941; 
              font-size: 20px; 
              margin-bottom: 5px;
            }
            .print-header h3 { 
              color: #2A4365; 
              font-size: 18px; 
              margin-bottom: 5px;
            }
            .print-header p { 
              color: #666; 
              font-size: 14px;
            }
            .print-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
              margin-bottom: 40px; 
            }
            .print-section { 
              border: 2px solid #e1e5e9; 
              padding: 20px; 
              border-radius: 10px; 
              background: #fafbfc;
            }
            .print-section h3 { 
              color: #2A4365; 
              font-size: 18px; 
              margin-bottom: 15px; 
              border-bottom: 2px solid #C87941;
              padding-bottom: 5px;
            }
            .print-detail { 
              margin-bottom: 10px; 
            }
            .print-detail strong { 
              color: #2A4365; 
              display: inline-block; 
              width: 120px;
              font-weight: 600;
            }
            .print-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 30px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .print-table th { 
              background: linear-gradient(135deg, #2A4365 0%, #2A4365 100%); 
              color: white; 
              padding: 12px 8px; 
              text-align: left; 
              font-weight: bold;
              font-size: 14px;
            }
            .print-table td { 
              padding: 10px 8px; 
              border-bottom: 1px solid #e1e5e9; 
            }
            .print-table tr:nth-child(even) { 
              background-color: #f8f9fa; 
            }
            .print-table tr:hover { 
              background-color: #e8f4f8; 
            }
            .print-total-row { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important; 
              border-top: 3px solid #C87941;
              font-weight: bold;
              font-size: 16px;
            }
            .print-total-row td { 
              color: #2A4365;
              padding: 15px 8px;
              border-bottom: none;
            }
            .print-summary { 
              margin-top: 30px; 
              padding: 20px; 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 10px;
              border: 2px solid #C87941;
            }
            .summary-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 10px;
              padding: 5px 0;
            }
            .summary-row.total { 
              font-size: 20px; 
              font-weight: bold; 
              color: #2A4365;
              border-top: 2px solid #C87941;
              padding-top: 15px;
              margin-top: 15px;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 25px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .status-delivered { background: #d4edda; color: #155724; border: 2px solid #c3e6cb; }
            .status-processing { background: #fff3cd; color: #856404; border: 2px solid #ffeaa7; }
            .status-shipped { background: #cce5ff; color: #004085; border: 2px solid #99d6ff; }
            .status-cancelled { background: #f8d7da; color: #721c24; border: 2px solid #f5c6cb; }
            .status-pending { background: #ffe8d1; color: #8B4513; border: 2px solid #ffd1ac; }
            @media print {
              body { padding: 20px; }
              .print-section { break-inside: avoid; }
              .print-table { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
           <div class="print-header">
        <div class="company-info">
          <h1>SARVIN ELECTRONICS</h1>
          <h3>ORDER DETAILS</h3>
          <h2>Order #${orderInfo.orderId}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
          </div>

          <div class="print-grid">
            <div class="print-section">
              <h3>Order Information</h3>
              <div class="print-detail"><strong>Order ID:</strong> #${orderInfo.orderId}</div>
              <div class="print-detail"><strong>Date:</strong> ${orderInfo.date}</div>
              <div class="print-detail"><strong>Status:</strong> <span class="status-badge status-${orderInfo.status.toLowerCase()}">${orderInfo.status}</span></div>
              <div class="print-detail"><strong>Payment:</strong> ${orderInfo.paymentStatus}</div>
              <div class="print-detail"><strong>Method:</strong> ${orderInfo.paymentMethod}</div>
            </div>

            <div class="print-section">
              <h3>Customer Information</h3>
              <div class="print-detail"><strong>Name:</strong> ${orderInfo.customer}</div>
              <div class="print-detail"><strong>Email:</strong> ${orderInfo.email}</div>
              <div class="print-detail"><strong>Phone:</strong> ${orderInfo.phone}</div>
            </div>
          </div>

          ${orderInfo.address ? `
          <div class="print-section" style="margin-bottom: 40px;">
            <h3>Shipping Address</h3>
            <div class="print-detail"><strong>Name:</strong> ${orderInfo.address.fullName || 'N/A'}</div>
            <div class="print-detail"><strong>Address:</strong> ${orderInfo.address.address || 'N/A'}</div>
            <div class="print-detail"><strong>City:</strong> ${orderInfo.address.city || 'N/A'}, ${orderInfo.address.state || 'N/A'} ${orderInfo.address.postalCode || 'N/A'}</div>
            <div class="print-detail"><strong>Country:</strong> ${orderInfo.address.country || 'N/A'}</div>
          </div>
          ` : ''}

          <table class="print-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">GST (18%)</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => {
                const quantity = item.quantity || item.qty || 1;
                const itemTotal = (item.price || 0) * quantity;
                const itemGST = calculateGSTFromTotal(itemTotal);
                const itemBasePrice = calculateBasePrice(itemTotal);
                const productName = getProductName(item);
                
                return `
                  <tr>
                    <td>${productName}</td>
                    <td style="text-align: center;">${quantity}</td>
                    <td style="text-align: right;">${formatCurrency(itemBasePrice)}</td>
                    <td style="text-align: right;">${formatCurrency(itemGST)}</td>
                    <td style="text-align: right; font-weight: bold;">${formatCurrency(itemTotal)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="print-total-row">
                <td><strong>TOTAL</strong></td>
                <td style="text-align: center;"><strong>${totals.totalQuantity}</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(totals.totalBasePrice)}</strong></td>
                <td style="text-align: right;"><strong>${formatCurrency(totals.totalGST)}</strong></td>
                <td style="text-align: right; font-size: 18px;"><strong>${formatCurrency(totals.totalAmount)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div class="print-summary">
            <div class="summary-row">
              <span>Delivery Charges:</span>
              <span style="color: #28a745; font-weight: bold;">FREE</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL AMOUNT:</span>
              <span style="color: #C87941;">${formatCurrency(totals.totalAmount)}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExportOrder = () => {
    // Create Excel-compatible CSV data - ONLY ITEMS TABLE
    const csvData = [];
    const items = order.orderItems || order.items || [];
    const totals = calculateTotals();
    
    // Add table headers
    csvData.push(['Product Name', 'Quantity', 'Unit Price (₹)', 'GST Amount (₹)', 'Total Amount (₹)']);
    
    // Add items data
    items.forEach(item => {
      const quantity = item.quantity || item.qty || 1;
      const itemTotal = (item.price || 0) * quantity;
      const itemGST = calculateGSTFromTotal(itemTotal);
      const itemBasePrice = calculateBasePrice(itemTotal);
      const productName = getProductName(item);
      
      csvData.push([
        productName,
        quantity,
        itemBasePrice.toFixed(2),
        itemGST.toFixed(2),
        itemTotal.toFixed(2)
      ]);
    });
    
    // Add totals row
    csvData.push([
      'TOTAL',
      totals.totalQuantity,
      totals.totalBasePrice.toFixed(2),
      totals.totalGST.toFixed(2),
      totals.totalAmount.toFixed(2)
    ]);
    
    // Convert to CSV string
    const csvString = csvData.map(row => 
      row.map(field => {
        // Handle fields that might contain commas or quotes
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',')
    ).join('\n');
    
    // Add BOM for proper Excel encoding
    const BOM = '\uFEFF';
    const csvContent = BOM + csvString;
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `order-items-${order._id.slice(-8)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEmailCustomer = () => {
    if (order.user?.email) {
      const subject = `Order Update - #${order._id.slice(-8)}`;
      const body = `Dear ${order.user.name || 'Customer'},\n\nYour order #${order._id.slice(-8)} has been updated.\n\nCurrent Status: ${getOrderStatus(order)}\n\nThank you for your business!`;
      window.location.href = `mailto:${order.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onUpdateStatus(order._id, 'cancelled');
    }
  };

  const totals = calculateTotals();
  const items = order.orderItems || order.items || [];
  const canCancelOrder = getOrderStatus(order) !== 'cancelled' && getOrderStatus(order) !== 'delivered';

 return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header - Hidden in print */}
        <div className="bg-white rounded-t-lg shadow-sm border-b border-gray-200 px-3 sm:px-6 py-4 no-print">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={onClose}
                className="mr-2 sm:mr-4 p-2 rounded-lg text-gray-600 hover:text-white hover:bg-[#2A4365] transition-colors flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-[#2A4365] truncate">Order Details</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Order ID: #{order.orderId || order._id.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusClass(getOrderStatus(order))}`}>
                {getOrderStatus(order).charAt(0).toUpperCase() + getOrderStatus(order).slice(1)}
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#C87941]">
                {formatCurrency(totals.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Print Area */}
        <div className="order-details-print-area bg-white rounded-b-lg shadow-sm">
          {/* Print Header - Only visible in print */}
          <div className="print-header" style={{display: 'none'}}>
            <h1>Order Details</h1>
            <h2>Order ID: #{order.orderId || order._id.slice(-8)}</h2>
            <p>Date: {formatDate(order.createdAt)}</p>
          </div>

          {/* Main Content Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 p-3 sm:p-6">
            {/* Order Information */}
            <div className="md:col-span-1 flex">
              <div className="bg-gradient-to-br from-[#2A4365] to-[#2A4365]/80 rounded-lg p-4 sm:p-6 text-white w-full flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  <h2 className="text-base sm:text-lg font-semibold">Order Information</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 flex-grow">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Order ID</p>
                    <p className="font-medium text-sm sm:text-base">#{order.orderId || order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Date</p>
                    <p className="font-medium text-sm sm:text-base">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Payment Status</p>
                    <p className="font-medium text-sm sm:text-base">
                      {order.isPaid || order.paymentStatus === 'completed' ? 'Paid' : 'Not Paid'}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Payment Method</p>
                    <p className="font-medium text-sm sm:text-base capitalize">{order.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="md:col-span-1 flex">
              <div className="bg-gradient-to-br from-[#C87941] to-[#C87941]/90 rounded-lg p-4 sm:p-6 text-white w-full flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  <h2 className="text-base sm:text-lg font-semibold">Customer Information</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 flex-grow">
                  <div>
                    <p className="text-orange-100 text-xs sm:text-sm">Name</p>
                    <p className="font-medium text-sm sm:text-base">{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs sm:text-sm">Email</p>
                    <p className="font-medium text-xs sm:text-sm break-all">{order.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs sm:text-sm">Phone</p>
                    <p className="font-medium text-sm sm:text-base">{order.shippingAddress?.phone || order.user?.phone || 'N/A'}</p>
                  </div>
                  {order.paymentId && (
                    <div>
                      <p className="text-orange-100 text-xs sm:text-sm">Payment ID</p>
                      <p className="font-medium text-xs bg-white/20 p-2 rounded break-all">{order.paymentId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="md:col-span-1 flex">
              <div className="bg-white border-2 border-[#2A4365] rounded-lg p-4 sm:p-6 w-full flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#2A4365]" />
                  <h2 className="text-base sm:text-lg font-semibold text-[#2A4365]">Shipping Address</h2>
                </div>
                <div className="space-y-2 flex-grow">
                  {order.shippingAddress ? (
                    <>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{order.shippingAddress.fullName || 'N/A'}</p>
                      <p className="text-gray-700 text-sm">{order.shippingAddress.address || 'N/A'}</p>
                      <p className="text-gray-700 text-sm">
                        {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.state || 'N/A'} {order.shippingAddress.postalCode || 'N/A'}
                      </p>
                      <p className="text-gray-700 text-sm">{order.shippingAddress.country || 'N/A'}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">No shipping address available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="md:col-span-1 flex">
              <div className="bg-white border-2 border-[#C87941] rounded-lg p-4 sm:p-6 w-full flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#C87941]" />
                  <h2 className="text-base sm:text-lg font-semibold text-[#C87941]">Update Status</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 flex-grow">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Current Status
                    </label>
                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border ${getStatusClass(getOrderStatus(order))}`}>
                      {getOrderStatus(order).charAt(0).toUpperCase() + getOrderStatus(order).slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Change Status
                    </label>
                    <div className="relative">
  <button
    type="button"
    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
    disabled={statusUpdateLoading}
    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-[#C87941]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C87941] focus:border-[#C87941] bg-white text-gray-800 font-medium transition-all duration-200 text-sm sm:text-base flex items-center justify-between hover:border-[#C87941]/50 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="capitalize">
      {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
    </span>
    <ChevronDown 
      className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${
        statusDropdownOpen ? 'rotate-180' : ''
      }`} 
    />
  </button>

  {statusDropdownOpen && (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-10"
        onClick={() => setStatusDropdownOpen(false)}
      ></div>
      
      {/* Dropdown */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#C87941]/30 rounded-lg shadow-lg z-20 overflow-hidden">
        {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              setSelectedStatus(status);
              setStatusDropdownOpen(false);
              if (status !== getOrderStatus(order)) {
                onUpdateStatus(order._id, status);
              }
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-[#C87941]/10 transition-colors duration-150 flex items-center justify-between group text-sm sm:text-base"
          >
            <span className="capitalize font-medium text-gray-700 group-hover:text-[#C87941]">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            {selectedStatus === status && (
              <Check className="h-4 w-4 text-[#C87941]" />
            )}
          </button>
        ))}
      </div>
    </>
  )}
</div>
                  </div>
                  {statusUpdateLoading && (
                    <div className="flex items-center text-xs sm:text-sm text-[#C87941]">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating status...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="px-3 sm:px-6 pb-6">
            <div className="bg-white border-2 border-[#2A4365] rounded-lg overflow-hidden">
              <div className="bg-[#2A4365] px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-white flex items-center">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Order Items
                </h2>
              </div>
              
              {/* Mobile View - Card Layout */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {items.map((item, index) => {
                    const quantity = item.quantity || item.qty || 1;
                    const itemTotal = (item.price || 0) * quantity;
                    const itemGST = calculateGSTFromTotal(itemTotal);
                    const itemBasePrice = calculateBasePrice(itemTotal);
                    const productName = getProductName(item);
                    const productImage = getProductImage(item);

                    return (
                      <div key={item._id || index} className="p-4 bg-white">
                        <div className="flex items-start space-x-3">
                          {productImage ? (
                            <div 
                              className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                              onClick={() => handleProductImageClick(item)}
                            >
                              <img 
                                src={productImage} 
                                alt={productName} 
                                className="w-10 h-10 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                                No Image
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                              onClick={() => handleProductImageClick(item)}
                            >
                              <span className="text-gray-500 text-xs text-center">No Image</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{productName}</p>
                            {item.product && typeof item.product === 'string' && (
                              <p className="text-xs text-gray-500 mt-1 truncate">ID: {item.product}</p>
                            )}
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Qty:</span>
                                <span className="ml-1 font-medium text-[#2A4365]">{quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Unit:</span>
                                <span className="ml-1 font-medium">{formatCurrency(itemBasePrice)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">GST:</span>
                                <span className="ml-1 font-medium text-[#C87941]">{formatCurrency(itemGST)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-1 font-bold text-gray-900">{formatCurrency(itemTotal)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Mobile Summary */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Items:</span>
                      <span className="text-sm font-bold text-[#2A4365]">{totals.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Base Price:</span>
                      <span className="text-sm font-bold">{formatCurrency(totals.totalBasePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">GST (18%):</span>
                      <span className="text-sm font-bold text-[#C87941]">{formatCurrency(totals.totalGST)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Delivery:</span>
                      <span className="text-sm font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-lg font-bold text-[#2A4365]">TOTAL:</span>
                      <span className="text-lg font-bold text-[#C87941]">{formatCurrency(totals.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop View - Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full print-table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST (18%)
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => {
                      const quantity = item.quantity || item.qty || 1;
                      const itemTotal = (item.price || 0) * quantity;
                      const itemGST = calculateGSTFromTotal(itemTotal);
                      const itemBasePrice = calculateBasePrice(itemTotal);
                      const productName = getProductName(item);
                      const productImage = getProductImage(item);

                      return (
                        <tr key={item._id || index} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center">
                              {productImage ? (
                                <div 
                                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 cursor-pointer"
                                  onClick={() => handleProductImageClick(item)}
                                >
                                  <img 
                                    src={productImage} 
                                    alt={productName} 
                                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                                    No Image
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 cursor-pointer"
                                  onClick={() => handleProductImageClick(item)}
                                >
                                  <span className="text-gray-500 text-xs text-center">No Image</span>
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{productName}</p>
                                {item.product && typeof item.product === 'string' && (
                                  <p className="text-xs text-gray-500 mt-1 truncate">ID: {item.product}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm font-medium text-[#2A4365]">
                              {quantity}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-gray-900">
                            {formatCurrency(itemBasePrice)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-[#C87941]">
                            {formatCurrency(itemGST)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-900">
                            {formatCurrency(itemTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr className="text-gray-800">
                      <td className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700">TOTAL</td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm font-bold text-[#2A4365]">
                          {totals.totalQuantity}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-sm font-bold text-gray-700">{formatCurrency(totals.totalBasePrice)}</td>
                      <td className="px-4 sm:px-6 py-4 text-right text-sm font-bold text-[#C87941]">{formatCurrency(totals.totalGST)}</td>
                      <td className="px-4 sm:px-6 py-4 text-right text-base sm:text-lg font-bold text-[#2A4365]">{formatCurrency(totals.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Desktop Final Summary */}
              <div className="hidden sm:block bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 print-summary">
                <div className="flex justify-end">
                  <div className="w-full max-w-sm">
                    <div className="flex justify-between items-center mb-2 pr-4">
                      <span className="text-sm font-medium text-gray-700">Delivery Charges</span>
                      <span className="text-sm font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 pr-4">
                      <span className="text-lg sm:text-xl font-bold text-[#2A4365]">TOTAL AMOUNT</span>
                      <span className="text-lg sm:text-xl font-bold text-[#C87941]">
                        {formatCurrency(totals.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Hidden in print */}
        <div className="px-3 sm:px-6 pb-6 no-print">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Order Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={handlePrintOrder}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-[#2A4365] text-white rounded-lg hover:bg-[#2A4365]/90 transition-colors text-sm sm:text-base"
              >
                <Printer className="h-4 w-4 mr-1 sm:mr-2" />
                Print
              </button>
              <button
                onClick={handleExportOrder}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-[#C87941] text-white rounded-lg hover:bg-[#C87941]/90 transition-colors text-sm sm:text-base"
              >
                <Download className="h-4 w-4 mr-1 sm:mr-2" />
                Export
              </button>
              {order.user?.email && (
                <button
                  onClick={handleEmailCustomer}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 border-2 border-[#2A4365] text-[#2A4365] rounded-lg hover:bg-[#2A4365] hover:text-white transition-colors text-sm sm:text-base"
                >
                  <Mail className="h-4 w-4 mr-1 sm:mr-2" />
                  Email
                </button>
              )}
              {canCancelOrder && (
                <button
                  onClick={handleCancelOrder}
                  disabled={statusUpdateLoading}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  <X className="h-4 w-4 mr-1 sm:mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;