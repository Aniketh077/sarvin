import React from 'react';
import { Minus, Plus, Check, ShoppingCart, Star, TruckIcon, ShieldCheck, Heart } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ 
  product, 
  quantity, 
  incrementQuantity, 
  decrementQuantity, 
  setQuantity, 
  handleAddToCart, 
  isDescriptionExpanded, 
  setIsDescriptionExpanded, 
  collectionName
}) => {
  const typeName = product.type?.name || product.type || 'Unknown';

  return (
    <div className="p-6 flex flex-col">
      <div className="mb-1 text-sm text-gray-500">{typeName}</div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => {
            const fillPercent = Math.min(Math.max(product.rating - (star - 1), 0), 1) * 100;

            return (
              <div key={star} className="relative w-5 h-5 mr-0.5">
                <Star className="w-5 h-5 text-gray-200" fill="#E0E0E0" />
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star className="w-5 h-5 text-[#C87941]" fill="#C87941" />
                </div>
              </div>
            );
          })}
          <span className="ml-2 text-sm font-medium">{product.rating}</span>
        </div>
        <span className="mx-2 text-gray-300">|</span>
        <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
      </div>
      
      <div className="mb-4">
        {product.discountPrice ? (
          <div className="flex items-center">
            <span className="text-3xl font-bold">₹{product.discountPrice.toFixed(2)}</span>
            <span className="ml-2 text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
          </div>
        ) : (
          <span className="text-3xl font-bold">₹{product.price.toFixed(2)}</span>
        )}
      </div>
      
      <div className="mb-6">
        <p className={`text-gray-600 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
          {product.description}
        </p>
        {product.description.length > 150 && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-[#2A4365] text-sm font-medium hover:text-[#C87941] mt-1"
          >
            {isDescriptionExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {/* Key Features */}
      {product.features && product.features.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Key Features</h3>
          <ul className="space-y-1">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-[#2A4365] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Stock */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${
            product.stock > 5 ? 'bg-green-500' : 
            product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">
            {product.stock > 5
              ? 'In Stock'
              : product.stock > 0
              ? `Low Stock (${product.stock} left)`
              : 'Out of Stock'}
          </span>
        </div>
      </div>
      
      {/* Quantity Selector and Add to Cart */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex items-center border border-gray-300 rounded-md w-36">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-[#2A4365] disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val > 0 && val <= product.stock) {
                setQuantity(val);
              }
            }}
            className="h-10 w-16 border-0 text-center focus:ring-0"
            min="1"
            max={product.stock}
          />
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="h-10 w-10 flex items-center justify-center text-gray-600 hover:text-[#2A4365] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<ShoppingCart className="h-5 w-5" />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          fullWidth
          className="flex-1"
        >
          Add to Cart
        </Button>
        {/* <Button
          variant="outline"
          size="lg"
          className="w-14 flex-shrink-0"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </Button> */}
      </div>
      
      {/* Benefits */}
      <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
        <div className="flex items-center">
          <TruckIcon className="h-5 w-5 text-[#2A4365] mr-3" />
          <span className="text-sm">Free shipping on orders across India.</span>
        </div>
        <div className="flex items-center">
          <ShieldCheck className="h-5 w-5 text-[#2A4365] mr-3" />
          <span className="text-sm">
            {(product.warranty&& product.warranty) || '1 year'} warranty
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center text-sm">
          <span className="text-gray-500">SKU: {product._id}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-gray-500">Collection: {collectionName}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;