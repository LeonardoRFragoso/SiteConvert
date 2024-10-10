import React, { useState } from 'react';
import Button from './components/ui/button';
import Input from './components/ui/input';
import Progress from './components/ui/progress';
import { ThemeProvider } from './context/ThemeContext'; // Contexto de tema
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // URL da API hardcoded
  const apiURL = 'http://192.168.0.4:5000';

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (!uploadedFile) {
      setError('Nenhum arquivo selecionado.');
      setFile(null);
      return;
    }

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

  const simulateProgress = (target) => {
    let currentProgress = progress;
    const interval = setInterval(() => {
      currentProgress += 5; // Incrementa de 5% a cada ciclo
      if (currentProgress >= target) {
        clearInterval(interval);
        setProgress(target);
      } else {
        setProgress(currentProgress);
      }
    }, 100); // A cada 100ms atualiza o progresso
  };

  const handleConversion = (format) => {
    if (!file) {
      setError('Por favor, envie um arquivo primeiro.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    let apiEndpoint = `${apiURL}/convert/image`;
    if (fileType === 'audio') {
      apiEndpoint = `${apiURL}/convert/audio`;
    } else if (fileType === 'application' && file.name.endsWith('.pdf')) {
      apiEndpoint = `${apiURL}/convert/pdf_to_images`;
    } else if (fileType === 'application' && file.name.endsWith('.docx')) {
      apiEndpoint = `${apiURL}/convert/docx_to_pdf`;
    }

    // Simula progresso inicial
    simulateProgress(50);

    fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao processar o arquivo');
        }
        // Simula progresso de 70% quando a resposta começa a ser recebida
        simulateProgress(70);
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        setConvertedFile(downloadUrl);
        // Simula o final do progresso
        simulateProgress(100);
        setIsProcessing(false);
      })
      .catch((err) => {
        setError(err.message || 'Erro inesperado ao converter o arquivo');
        console.error('Erro no processamento do arquivo:', err);
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
        <div className="header-container">
          <h1 className="text-3xl font-bold mb-4">Conversor de Arquivos</h1>
          {error && (
            <p className="text-red-500">
              <strong>Erro:</strong> {error}
            </p>
          )}
        </div>

        {/* File Uploader usando o Input modificado */}
        <div className="upload-container">
          <Input type="file" onChange={handleFileUpload} className="mt-4" />

          {/* Tipos de arquivos suportados */}
          <div className="file-info mt-4">
            <p className="text-white">
              <strong>Tipos de arquivos suportados:</strong>
            </p>
            <ul className="text-white">
              <li>Imagens: JPG, PNG, SVG, BMP, TIFF</li>
              <li>Áudio: MP3, WAV, OGG, FLAC, AAC, WMA, M4A</li>
              <li>Documentos: PDF, DOCX</li>
            </ul>
          </div>

          {file && fileType === 'image' && (
            <div className="mt-4">
              <img 
                src={URL.createObjectURL(file)} 
                alt="Pré-visualização" 
                className="image-preview"
              />
              <p className="text-white mt-2">Você pode converter imagens para JPEG, PNG, SVG, BMP, ou TIFF.</p>
            </div>
          )}

          {file && fileType === 'audio' && (
            <p className="text-white mt-2">Você pode converter áudio para MP3, WAV, OGG, FLAC, AAC, WMA, ou M4A.</p>
          )}

          {file && fileType === 'application' && file.name.endsWith('.pdf') && (
            <p className="text-white mt-2">Você pode converter PDFs para imagens.</p>
          )}

          {file && fileType === 'application' && file.name.endsWith('.docx') && (
            <p className="text-white mt-2">Você pode converter DOCX para PDF.</p>
          )}
        </div>

        {/* ConverterForm simples com botões */}
        {file && (
          <div className="mt-6">
            {fileType === 'image' && (
              <>
                <Button onClick={() => handleConversion('jpeg')}>Converter para JPEG</Button>
                <Button onClick={() => handleConversion('png')} className="ml-4">Converter para PNG</Button>
                <Button onClick={() => handleConversion('svg')} className="ml-4">Converter para SVG</Button>
                <Button onClick={() => handleConversion('bmp')} className="ml-4">Converter para BMP</Button>
                <Button onClick={() => handleConversion('tiff')} className="ml-4">Converter para TIFF</Button>
              </>
            )}

            {fileType === 'audio' && (
              <>
                <Button onClick={() => handleConversion('mp3')}>Converter para MP3</Button>
                <Button onClick={() => handleConversion('wav')} className="ml-4">Converter para WAV</Button>
                <Button onClick={() => handleConversion('ogg')} className="ml-4">Converter para OGG</Button>
                <Button onClick={() => handleConversion('flac')} className="ml-4">Converter para FLAC</Button>
                <Button onClick={() => handleConversion('aac')} className="ml-4">Converter para AAC</Button>
                <Button onClick={() => handleConversion('wma')} className="ml-4">Converter para WMA</Button>
                <Button onClick={() => handleConversion('m4a')} className="ml-4">Converter para M4A</Button>
              </>
            )}

            {fileType === 'application' && file.name.endsWith('.pdf') && (
              <Button onClick={() => handleConversion('pdf')}>Converter PDF para Imagens</Button>
            )}

            {fileType === 'application' && file.name.endsWith('.docx') && (
              <Button onClick={() => handleConversion('pdf')} className="ml-4">Converter DOCX para PDF</Button>
            )}
          </div>
        )}

        {/* Barra de progresso */}
        {progress > 0 && (
          <div className="mt-4">
            <Progress value={progress} />
          </div>
        )}

        {/* Link para download do arquivo convertido */}
        {convertedFile && (
          <div className="mt-6 text-center">
            <a href={convertedFile} download="arquivo_convertido" className="download-link">
              Baixar Arquivo Convertido
            </a>
          </div>
        )}

        {/* Footer simples */}
        <footer className="bg-gray-800 text-white text-center p-4 mt-10">
          <p>© 2024 Meu Conversor de Arquivos</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
