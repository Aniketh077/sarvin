import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Button from "./Button";
import {
  ShoppingCart,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);
    setError(null);

    try {
      await addToCart(product, 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const productId = product._id || product.id;
  const itemInCart = isInCart(productId);
  const quantity = getItemQuantity(productId);

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
        {/* Success/Error indicators */}
        {showSuccess && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-[#C87941] text-white px-4 py-2 rounded-lg flex items-center">
            <CheckCircle size={16} className="mr-2" />
            Added to cart!
          </div>
        )}

        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center max-w-xs text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Badges */}
        {product.discountPrice && (
  Math.round(((product.price - product.discountPrice) / product.price) * 100) > 0 && (
    <div className="absolute left-0 top-4 z-10 bg-red-500 px-3 py-1 text-sm font-semibold text-white">
      {Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )}
      % OFF
    </div>
  )
)}

        {product.newArrival && (
          <div className="absolute right-0 top-4 z-10 bg-[#2A4365] px-3 py-1 text-sm font-semibold text-white">
            NEW
          </div>
        )}

        {/* Image Section */}
        <div className="md:w-1/3 h-60 md:h-auto relative overflow-hidden bg-gray-100">
          <Link to={`/product/${productId}`} className="block h-full">
            <img
              src={
                product.image || product.images[0] || "/placeholder-image.jpg"
              }
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Details Section */}
        <div className="p-6 flex-1 flex flex-col">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {product.type?.name || product.collection?.name}
            </p>
            <Link to={`/product/${productId}`}>
              <h3 className="text-lg font-medium mb-2 group-hover:text-[#2A4365]">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-[#C87941] text-[#C87941]" />
                <span className="text-sm font-medium">
                  {product.rating || 0}
                </span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                {product.reviewCount || 0} reviews
              </span>
            </div>

            <div className="mb-4">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-xl font-semibold">
                    ₹{product.discountPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-semibold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>

            {product.features?.length > 0 && (
              <div className="space-y-1 mb-4">
                {product.features.slice(0, 3).map((feature, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    • {feature}
                  </p>
                ))}
              </div>
            )}

            {/* Stock indicator */}
            {product.stock === 0 && (
              <div className="text-sm text-red-500 mb-3">Out of stock</div>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="text-sm text-orange-500 mb-3">
                Only {product.stock} left
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <Button
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/product/${productId}`;
              }}
              className="w-full sm:w-auto"
            >
              View Details
            </Button>

            <Button
              variant={itemInCart ? "outline" : "primary"}
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              leftIcon={<ShoppingCart size={16} />}
              className="w-full sm:w-auto"
            >
              {isAdding
                ? "Adding..."
                : product.stock === 0
                ? "Out of Stock"
                : itemInCart
                ? `In Cart (${quantity})`
                : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
       {product.discountPrice && (
  Math.round(((product.price - product.discountPrice) / product.price) * 100) > 0 && (
    <div className="absolute left-0 top-4 z-10 bg-red-500 px-3 py-1 text-sm font-semibold text-white">
      {Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )}
      % OFF
    </div>
  )
)}


      {product.newArrival && (
        <div className="absolute right-0 top-4 z-10 bg-[#2A4365] px-3 py-1 text-sm font-semibold text-white">
          NEW
        </div>
      )}

      {/* Success/Error indicators */}
      {showSuccess && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-[#C87941] text-white px-4 py-2 rounded-lg flex items-center">
          <CheckCircle size={16} className="mr-2" />
          Added to cart!
        </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center max-w-xs text-sm">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <Link to={`/product/${productId}`} className="block">
        <div className="relative h-60 overflow-hidden bg-gray-100 p-4">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <div className="mb-1 text-sm text-gray-500">
            {product.type?.name || product.type}
          </div>
          <h3 className="mb-2 text-base font-medium line-clamp-2 group-hover:text-[#2A4365]">
            {truncateText(product.name, 25)}
          </h3>

          <div className="mb-3 flex items-center">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-[#C87941] text-[#C87941]" />
              <span className="text-sm font-medium">{product.rating || 0}</span>
            </div>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-gray-500">
              {product.reviewCount || 0} reviews
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-lg font-semibold">
                    ₹{product.discountPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-semibold">
                  ₹{product.price.toFixed(2)}
                </span>
              )}

              {/* Stock indicator */}
              {product.stock === 0 && (
                <div className="text-xs text-red-500 mt-1">Out of stock</div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="text-xs text-orange-500 mt-1">
                  Only {product.stock} left
                </div>
              )}
            </div>

            <div className="flex flex-col items-end">
              {itemInCart ? (
                <div className="text-xs text-[#C87941] mb-1">
                  In cart ({quantity})
                </div>
              ) : null}

              <Button
                size="sm"
                variant="primary"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                leftIcon={<ShoppingCart size={16} />}
                className={`transition-opacity duration-300 ${
                  product.stock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {isAdding
                  ? "Adding..."
                  : product.stock === 0
                  ? "Out of Stock"
                  : "Add"}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
