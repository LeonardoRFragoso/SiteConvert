// src/components/ui/progress.js
import React from 'react';

const Progress = ({ value }) => {
  return (
    <div className="bg-gray-800 rounded shadow-lg mx-auto mt-4 progress-bar" style={{ width: '90%', maxWidth: '1200px' }}>
      <div
        className="bg-purple-600 text-xs font-medium text-purple-100 text-center progress-bar-inner leading-none rounded-full transition-all duration-300"
        style={{
          width: `${value}%`,
          background: 'linear-gradient(90deg, #a855f7, #c77dff)',
        }}
      >
        {value}%
      </div>
    </div>
  );
};

export default Progress;
