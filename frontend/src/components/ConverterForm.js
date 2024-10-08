import React, { useState } from 'react';

const ConverterForm = ({ onSubmit, formats }) => {
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedFormat);
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <label htmlFor="format-select" className="block text-gray-700 text-sm font-bold mb-2">
        Escolha o formato de conversão:
      </label>
      <select
        id="format-select"
        onChange={handleFormatChange}
        value={selectedFormat}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full"
      >
        Converter
      </button>
    </form>
  );
};

export default ConverterForm;
