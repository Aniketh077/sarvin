import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RelatedProducts = ({ relatedProducts, collectionName }) => {
  return (
    <section className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <Link
          to={`/products/${collectionName.toLowerCase().replace(/\s+/g, '-')}`}
          className="flex items-center text-[#2A4365] hover:text-[#C87941]"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <Link
            key={relatedProduct._id}
            to={`/product/${relatedProduct._id}`}
            className="group block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-60 overflow-hidden bg-gray-100 p-4">
              <img
                src={relatedProduct.image}
                alt={relatedProduct.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-medium line-clamp-2 group-hover:text-[#2A4365]">
                {relatedProduct.name}
              </h3>
              
              <div className="mt-2">
                {relatedProduct.discountPrice ? (
                  <div className="flex items-center">
                    <span className="font-semibold">₹{relatedProduct.discountPrice.toFixed(2)}</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">₹{relatedProduct.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="font-semibold">₹{relatedProduct.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;