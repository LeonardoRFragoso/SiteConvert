import React, { useState } from 'react';
import Navbar from './components/Navbar/navbar'; // Mantido se estiver em uso
import Footer from './components/Footer/footer'; // Mantido se estiver em uso
import FileUploader from './components/FileUploader'; // Mantido se estiver em uso
import ConverterForm from './components/ConverterForm'; // Mantido se estiver em uso
import ProgressBar from './components/ProgressBar'; // Mantido se estiver em uso
// eslint-disable-next-line no-unused-vars
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const apiURL = process.env.REACT_APP_API_URL;

  const handleFileUpload = (uploadedFile) => {
    const type = uploadedFile.type.split('/')[0];
    if (!['image', 'audio', 'application'].includes(type)) {
      setError('Tipo de arquivo não suportado. Por favor, envie uma imagem, áudio ou documento.');
      setFile(null);
      return;
    }

    setFileType(type);
    setFile(uploadedFile);
    setConvertedFile(null);
    setError('');
  };

  const handleConversion = (format) => {
    if (!file) {
      setError('Por favor, envie um arquivo primeiro.');
      return;
    }

    setIsProcessing(true);
    setProgress(20);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    let apiEndpoint = `${apiURL}/convert/image`;
    if (fileType === 'audio') apiEndpoint = `${apiURL}/convert/audio`;
    else if (fileType === 'application' && file.name.endsWith('.pdf')) apiEndpoint = `${apiURL}/convert/pdf_to_images`;
    else if (fileType === 'application' && file.name.endsWith('.docx')) apiEndpoint = `${apiURL}/convert/docx_to_pdf`;

    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao processar o arquivo');
        }
        setProgress(70);
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        setConvertedFile(downloadUrl);
        setProgress(100);
        setIsProcessing(false);
      })
      .catch((err) => {
        setError(err.message || 'Erro inesperado ao converter o arquivo');
        setProgress(0);
        setIsProcessing(false);
      });
  };

  const reset = () => {
    setFile(null);
    setFileType('');
    setConvertedFile(null);
    setProgress(0);
    setError('');
    setIsProcessing(false);
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar />

        <div className="header-container">
          <h1 className="text-3xl font-bold mb-4">Conversor de Arquivos</h1>
          {error && (
            <p className="text-red-500">
              <strong>Erro:</strong> {error}
            </p>
          )}
        </div>

        <div className="upload-container">
          <FileUploader onFileUpload={handleFileUpload} reset={reset} />

          {file && fileType === 'image' && (
            <div className="mt-4">
              <img 
                src={URL.createObjectURL(file)} 
                alt="Pré-visualização" 
                className="image-preview"
              />
            </div>
          )}
        </div>

        {file && (
          <ConverterForm
            onSubmit={handleConversion}
            formats={
              fileType === 'image'
                ? ['jpeg', 'png', 'gif', 'svg']
                : fileType === 'audio'
                ? ['mp3', 'wav', 'ogg', 'flac', 'aac']
                : file.name.endsWith('.pdf')
                ? ['png', 'jpeg', 'tiff', 'bmp']
                : ['pdf']
            }
            isProcessing={isProcessing}
          />
        )}

        {progress > 0 && <ProgressBar progress={progress} />}

        {convertedFile && (
          <div className="mt-6 text-center">
            <a href={convertedFile} download="arquivo_convertido" className="download-link">
              Baixar Arquivo Convertido
            </a>
          </div>
        )}

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
