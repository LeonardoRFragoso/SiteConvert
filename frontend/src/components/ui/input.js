import React, { useState } from 'react';

const Input = ({ type = 'text', className = '', onChange, ...props }) => {
  const [chosenFileName, setChosenFileName] = useState('Nenhum arquivo escolhido');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setChosenFileName(file.name); // Atualiza o estado com o nome do arquivo
    } else {
      setChosenFileName('Nenhum arquivo escolhido');
    }

    // Certifica-se de chamar a função onChange passada como prop
    if (onChange) {
      onChange(event);
    }
  };

  if (type === 'file') {
    return (
      <div className="file-upload-wrapper">
        <label className="custom-file-upload">
          Escolher arquivo
          <input 
            type="file" 
            className={`hidden ${className}`} 
            onChange={handleFileChange} // Garante que o evento onChange seja tratado
            {...props} 
          />
        </label>
        {/* Mostra o nome do arquivo escolhido com estilo adequado */}
        <span id="file-chosen" className="ml-2 text-purple-400">{chosenFileName}</span>
      </div>
    );
  }

  return (
    <input
      type={type}
      className={`px-4 py-2 border rounded ${className}`}
      onChange={onChange} // Garante que a função onChange seja chamada no caso de inputs normais
      {...props}
    />
  );
};

export default Input;
