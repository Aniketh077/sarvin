import React, { useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const ImageZoomModal = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full h-full max-w-7xl max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 z-10 text-[#1b344d] hover:text-[#1e3246] p-2"
          aria-label="Close"
        >
          <X className="w-8 h-8" />
        </button>

        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          wheel={{ step: 0.9 }}
          doubleClick={{ mode: 'reset' }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute top-2 left-2 z-10 bg-white/50 backdrop-blur-sm rounded-md p-1 flex space-x-1">
                <button onClick={() => zoomIn()} className="p-2 hover:bg-gray-200/50 rounded" aria-label="Zoom In">
                  <ZoomIn className="w-5 h-5 text-gray-800" />
                </button>
                <button onClick={() => zoomOut()} className="p-2 hover:bg-gray-200/50 rounded" aria-label="Zoom Out">
                  <ZoomOut className="w-5 h-5 text-gray-800" />
                </button>
                <button onClick={() => resetTransform()} className="p-2 hover:bg-gray-200/50 rounded" aria-label="Reset Zoom">
                  <RotateCcw className="w-5 h-5 text-gray-800" />
                </button>
              </div>

              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                  cursor: 'grab',
                }}
                contentStyle={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <img
                  src={imageUrl}
                  alt="Product zoom view"
                  className="max-w-full max-h-full object-contain"
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default ImageZoomModal;