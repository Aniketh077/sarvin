import React from 'react';

const ProductTabs = ({ product, activeTab, setActiveTab }) => {

  return (
    <div className="border-t border-gray-200">
      <div className="px-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-4 mr-8 font-medium text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'specifications' ? 'text-[#2A4365]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Specifications
            {activeTab === 'specifications' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2A4365]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('additionalInfo')}
            className={`py-4 mr-8 font-medium text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'additionalInfo' ? 'text-[#2A4365]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Additional Information
            {activeTab === 'additionalInfo' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2A4365]"></span>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="w-1/3 font-medium text-gray-900">{key}</span>
                  <span className="w-2/3 text-gray-600">{value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No specifications available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'additionalInfo' && (
          <div className="prose prose-sm max-w-none">
            <p>
              The {product.name} comes with a standard {(product.warranty && product.warranty) || '1 year'} warranty that covers manufacturing defects and malfunctions.
            </p>
            <p>
              For installation assistance or technical support, please contact our customer service team at sarvinhomeappl@gmail.com or call us at +91 93109 79906.
            </p>
            <h4>Care Instructions</h4>
            <ul>
              <li>Always read the user manual before operating this appliance</li>
              <li>Clean the exterior with a soft, damp cloth and mild detergent</li>
              <li>Ensure proper ventilation around the appliance</li>
              <li>Follow manufacturer's maintenance schedule for optimal performance</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;