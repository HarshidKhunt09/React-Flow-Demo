import React from 'react';

const ErrorFallback = ({ error }) => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-500 to-purple-600 text-white">
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h2>
      <p className="text-lg mb-4">Error: {error.message}</p>
    </div>
  </div>
);

export default ErrorFallback;
