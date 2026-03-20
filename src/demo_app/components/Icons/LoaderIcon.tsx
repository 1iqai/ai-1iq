import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 border-t-blue-500"></div>
    </div>
  );
};

export default Loader;
