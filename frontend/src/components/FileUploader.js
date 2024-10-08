import React, { useState } from 'react';

const FileUploader = ({ onFileUpload, reset }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleReset = () => {
    reset();
    setFileName('');
  };

  return (
    <div className="p-6 bg-gray-50 border-2 border-dashed border-blue-300 rounded-lg shadow-md">
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition duration-300"
      >
        {fileName ? 'Trocar arquivo' : 'Clique aqui para selecionar um arquivo'}
      </label>

      {fileName && (
        <p className="mt-2 text-gray-700">
          Arquivo selecionado: <span className="font-semibold">{fileName}</span>
        </p>
      )}

      <button
        onClick={handleReset}
        disabled={!fileName}
        className={`mt-4 py-2 px-4 rounded font-semibold focus:outline-none transition duration-300 ${
          !fileName
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-700 text-white'
        }`}
      >
        Resetar
      </button>
    </div>
  );
};

export default FileUploader;
