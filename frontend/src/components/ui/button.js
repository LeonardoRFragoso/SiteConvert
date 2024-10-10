// src/components/ui/button.js
import React from 'react';

const Button = ({ children, variant = 'default', isFileUpload = false, ...props }) => {
  // Estilos base para os botões, com foco em transições suaves e efeito neon
  const baseStyles = 'px-4 py-2 font-bold text-white rounded focus:outline-none transition-all duration-300 shadow-lg';

  // Variantes de estilos (default e secondary) com efeito neon
  const variants = {
    default: 'bg-purple-500 hover:bg-purple-700 shadow-neon-purple',
    secondary: 'bg-gray-500 hover:bg-gray-700 shadow-neon-gray',
  };

  // Estilos adicionais para o botão de upload de arquivo com borda tracejada
  const fileUploadStyles = 'cursor-pointer bg-transparent border border-dashed border-purple-500 hover:border-purple-700';

  // Combina as classes com base se o botão é um upload de arquivo ou não
  const className = `${baseStyles} ${variants[variant]} ${isFileUpload ? fileUploadStyles : ''}`;

  // Se for um botão de upload de arquivos, renderiza um label estilizado
  if (isFileUpload) {
    return (
      <label className={className}>
        {children}
        <input type="file" className="hidden" {...props} />
      </label>
    );
  }

  // Renderiza o botão normal
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
