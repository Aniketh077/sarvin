import React from 'react';
import { Link } from 'react-router-dom';

const ProductBreadcrumb = ({ product, collectionName }) => {
  return (
    <nav className="py-4">
      <ol className="flex text-sm overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <li className="flex items-center">
          <Link to="/" className="text-gray-500 hover:text-[#2A4365]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li className="flex items-center">
          <Link to="/products" className="text-gray-500 hover:text-[#2A4365]">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li className="flex items-center">
          <Link 
            to={`/products/${collectionName.toLowerCase().replace(/\s+/g, '-')}`} 
            className="text-gray-500 hover:text-[#2A4365]"
          >
            {collectionName}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
        </li>
        <li className="text-gray-900 font-medium">{product.name}</li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;