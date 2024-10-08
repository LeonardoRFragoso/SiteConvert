import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-500 py-4 text-white text-center mt-10">
      <div className="container mx-auto">
        <p className="text-sm">© 2024 PyScriptConvert. Todos os direitos reservados.</p> {/* Alterar aqui */}
        <ul className="flex justify-center space-x-4 mt-2">
          <li>
            <a href="/privacy" className="hover:underline">Política de Privacidade</a>
          </li>
          <li>
            <a href="/terms" className="hover:underline">Termos de Uso</a>
          </li>
          <li>
            <a href="/contact" className="hover:underline">Contato</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
