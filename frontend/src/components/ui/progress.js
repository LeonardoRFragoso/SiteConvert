// src/components/ui/progress.js
import React from "react";

const Progress = ({ value, isProcessing }) => {
  return (
    <div
      className="bg-gray-800 rounded shadow-lg mx-auto mt-4 progress-bar"
      style={{ width: "90%", maxWidth: "1200px" }}
    >
      <div
        className="bg-purple-600 text-xs font-medium text-purple-100 text-center progress-bar-inner leading-none rounded-full transition-all duration-300"
        style={{
          width: `${value}%`,
          background: isProcessing
            ? "linear-gradient(90deg, #a855f7, #c77dff)"
            : "linear-gradient(90deg, #22c55e, #16a34a)", // Verde no final
          animation: isProcessing ? "pulse 1.5s infinite" : "none",
        }}
      >
        {isProcessing ? `${value || "Carregando..."}%` : `${value}%`}
      </div>
    </div>
  );
};

export default Progress;

