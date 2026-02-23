import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500',
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
    }
  };

  const { icon: Icon, bgColor, textColor, borderColor } = getTypeConfig();

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border ${borderColor} shadow-lg animate-fade-in-up`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${textColor} mt-0.5 mr-2`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;