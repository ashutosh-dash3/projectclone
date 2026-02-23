import React from 'react';

const SkeletonLoader = ({ type = 'default', className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  switch (type) {
    case 'card':
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="p-4 space-y-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      );
    case 'image':
      return <div className={`${baseClasses} ${className}`}></div>;
    case 'text':
      return <div className={`${baseClasses} ${className} h-4`}></div>;
    case 'button':
      return <div className={`${baseClasses} ${className} h-10`}></div>;
    case 'avatar':
      return <div className={`${baseClasses} ${className} rounded-full`}></div>;
    default:
      return <div className={`${baseClasses} ${className}`}></div>;
  }
};

export default SkeletonLoader;