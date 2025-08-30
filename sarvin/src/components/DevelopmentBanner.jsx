import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm md:text-base font-medium">
            <span className="font-bold">🚧 WEBSITE UNDER DEVELOPMENT 🚧</span>
            <span className="hidden sm:inline ml-2">
              - Please do not make any purchases. We'll be launching in a few days!
            </span>
            <span className="sm:hidden ml-2">
              - Do not purchase. Launching soon!
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20  transition-colors duration-200 flex-shrink-0"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DevelopmentBanner;