// src/components/ui/progress.js
import React from 'react';

const Progress = ({ value }) => {
  return (
    <div className="w-full bg-gray-800 rounded shadow-lg max-w-lg mx-auto mt-4">
      <div
        className="bg-purple-600 text-xs font-medium text-purple-100 text-center p-1 leading-none rounded-full transition-all duration-300"
        style={{
          width: `${value}%`,
          boxShadow: '0 0 12px #a855f7, 0 0 20px #c77dff',
          background: 'linear-gradient(90deg, #a855f7, #c77dff)',
        }}
      >
        {value}%
      </div>
    </div>
  );
};

export default Progress;
