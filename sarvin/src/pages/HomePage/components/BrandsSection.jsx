import React from 'react';
import { Link } from 'react-router-dom';

const typesSection = ({ types }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted types</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We partner with the most trusted types in the industry
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {types.map((type) => (
            <Link
              key={type.id}
              to={`/products?type=${encodeURIComponent(type.name)}`}
              className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center transition-all hover:shadow-md hover:-translate-y-1 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#EBF5FF] transition-colors">
                  <span className="text-2xl font-bold text-[#2A4365]">
                    {type.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#2A4365] transition-colors">
                  {type.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default typesSection;
