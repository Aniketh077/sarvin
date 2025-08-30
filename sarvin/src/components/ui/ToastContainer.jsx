import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-600'
        };
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);
        const IconComponent = styles.icon;

        return (
          <div
            key={toast.id}
            className={`
              ${styles.bg} ${styles.border} ${styles.text}
              border  p-4 shadow-lg min-w-80 max-w-md
              transform transition-all duration-300 ease-in-out
              animate-slide-in-right
            `}
          >
            <div className="flex items-start">
              <IconComponent 
                className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${styles.iconColor}`} 
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`
                  ml-3 flex-shrink-0 p-1 
                  hover:bg-black hover:bg-opacity-10
                  transition-colors duration-200
                  ${styles.iconColor}
                `}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;