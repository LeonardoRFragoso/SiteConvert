import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between">
        <a href="/" className="text-white font-bold text-lg">PyScriptConvert</a> {/* Alterar aqui */}
        <ul className="flex space-x-4">
          <li><a href="/" className="text-white">Início</a></li>
          <li><a href="/about" className="text-white">Sobre</a></li>
          <li><a href="/help" className="text-white">Ajuda</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
