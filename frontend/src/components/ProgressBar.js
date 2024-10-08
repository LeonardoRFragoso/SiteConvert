const ProgressBar = ({ progress }) => {
  return (
    <div className="bg-gray-300 rounded-full h-2 overflow-hidden mt-4 shadow-inner">
      <div
        className="bg-green-500 h-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      >
        <span className="text-sm font-semibold text-green-700 block text-center mt-2">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
