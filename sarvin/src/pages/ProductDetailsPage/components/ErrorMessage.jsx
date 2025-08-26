import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const ErrorMessage = ({ error }) => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {error === "Product not found" ? "Product not found" : "Error Loading Product"}
        </h2>
        <p className="text-gray-600 mb-4">
          {error === "Product not found" 
            ? "The product you're looking for doesn't exist or has been removed."
            : error
          }
        </p>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorMessage;