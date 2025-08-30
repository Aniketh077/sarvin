import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react'; 
import ImageZoomModal from './ImageZoomModal';
import useIsDesktop from '../../../hooks/useIsDesktop';

const ProductImages = ({ product, activeImage, setActiveImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const getProductImages = () => {
    const images = [];
    if (product.image) {
      images.push(product.image);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img !== product.image) {
          images.push(img);
        }
      });
    }
    return images;
  };

  const productImages = getProductImages();
  const currentImageUrl = productImages[activeImage] || product.image;
  
  const handleImageClick = () => {
    if (isDesktop) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="relative mb-4 aspect-square overflow-hidden">
          <img
            src={currentImageUrl}
            alt={product.name}
            className={`w-full h-full object-contain p-4 ${isDesktop ? 'cursor-zoom-in' : ''}`}
            onClick={handleImageClick}
          />
          
          {/* Discount and New Arrival Badges */}
          {product.discountPrice &&
            Math.round(((product.price - product.discountPrice) / product.price) * 100) > 0 && (
              <div className="absolute left-0 top-4 z-10 bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                {Math.round(
                  ((product.price - product.discountPrice) / product.price) * 100
                )}
                % OFF
              </div>
            )}
          {product.newArrival && (
            <div className="absolute right-4 top-4 z-10 bg-[#2A4365] px-3 py-1 text-sm font-semibold text-white">
              NEW
            </div>
          )}
=
          {isDesktop && (
            <button
              onClick={handleImageClick}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-2  bg-white/80 px-3 py-2 text-sm text-gray-800 border  backdrop-blur-sm transition-all hover:bg-white"
              aria-label="Expand image"
            >
              <ZoomIn className="h-4 w-4 " />
              <span>Click to expand</span>
            </button>
          )}
        </div>
        
        {productImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden ${
                  activeImage === index ? 'border-[#2A4365]' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - view ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && isDesktop && (
        <ImageZoomModal 
          imageUrl={currentImageUrl} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductImages;