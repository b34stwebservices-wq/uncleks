import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin">
        <div className="h-12 w-12 border-4 border-primary-900 border-t-transparent rounded-full"></div>
      </div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
