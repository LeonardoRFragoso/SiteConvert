import React, { useState, useEffect, useRef } from "react";
import Button from "./components/ui/button";
import Input from "./components/ui/input";
import Progress from "./components/ui/progress";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [convertedFile, setConvertedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("");

  const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const progressIntervalRef = useRef(null);

  // Marcos de progresso e mensagens correspondentes
  const progressMilestones = [
    { percentage: 10, message: "Iniciando a conversão..." },
    { percentage: 25, message: "Enviando arquivo..." },
    { percentage: 50, message: "Processando dados..." },
    { percentage: 75, message: "Convertendo formato..." },
    { percentage: 90, message: "Quase lá..." },
  ];

  // Função para simular progresso contínuo
  const simulateProgress = () => {
    let currentStep = 0;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        // Atualiza a mensagem conforme os marcos
        if (
          currentStep < progressMilestones.length &&
          prevProgress >= progressMilestones[currentStep].percentage
        ) {
          setProgressMessage(progressMilestones[currentStep].message);
          currentStep += 1;
        }

        if (prevProgress >= 90) {
          clearInterval(progressIntervalRef.current);
          return prevProgress;
        }

        return Math.min(prevProgress + 5, 90); // Incrementa em 5% por ciclo até 90%
      });
    }, 500); // A cada 500ms
  };

  // Limpeza do intervalo ao desmontar o componente
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (!uploadedFile) {
      setError("Nenhum arquivo selecionado.");
      setFile(null);
      return;
    }

    const type = uploadedFile.type.split("/")[0];
    const extension = uploadedFile.name.split(".").pop().toLowerCase();

    const supportedFormats = {
      image: ["jpeg", "jpg", "png", "svg", "bmp", "tiff", "ico", "webp", "gif"],
      audio: ["mp3", "wav", "ogg", "flac", "m4a"],
      application: ["pdf", "docx"],
    };

    if (!supportedFormats[type]?.includes(extension)) {
      setError(`Formato de arquivo .${extension} não é suportado.`);
      setFile(null);
      return;
    }

    setFileType(type);
    setFile(uploadedFile);
    setConvertedFile(null);
    setError("");
  };

  const handleConversion = (format) => {
    if (!file) {
      setError("Por favor, envie um arquivo primeiro.");
      return;
    }

    // Validação específica para PDF
    if (fileType === "application" && file.name.endsWith(".pdf")) {
      const supportedImageFormats = [
        "png",
        "jpeg",
        "tiff",
        "bmp",
        "gif",
        "webp",
      ];
      if (!supportedImageFormats.includes(format)) {
        setError(
          `Formato '${format}' não é suportado para conversão de PDF. Formatos válidos: ${supportedImageFormats.join(
            ", "
          )}.`
        );
        return;
      }
    }

    setIsProcessing(true);
    setProgress(10); // Inicia com 10% fictício
    setProgressMessage(progressMilestones[0].message); // Mensagem inicial
    setDownloadFormat(format);

    simulateProgress(); // Inicia simulação de progresso contínuo

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    let apiEndpoint = `${apiURL}/convert/image`;
    if (fileType === "audio") {
      apiEndpoint = `${apiURL}/convert/audio`;
    } else if (fileType === "application" && file.name.endsWith(".pdf")) {
      apiEndpoint = `${apiURL}/convert/pdf_to_images`;
    } else if (fileType === "application" && file.name.endsWith(".docx")) {
      apiEndpoint = `${apiURL}/convert/docx_to_pdf`;
    }

    fetch(apiEndpoint, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erro do servidor: ${response.status} - ${response.statusText}`
          );
        }
        setProgressMessage("Finalizando conversão...");
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        setConvertedFile(downloadUrl);
        setProgress(100); // Finaliza o progresso em 100%
        setProgressMessage("Conversão concluída!");
      })
      .catch((err) => {
        setError(err.message || "Erro inesperado ao converter o arquivo");
        setProgressMessage("");
        console.error("Erro no processamento do arquivo:", err);
      })
      .finally(() => {
        setIsProcessing(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current); // Limpa o intervalo ao finalizar
        }
      });
  };

  const reset = () => {
    setFile(null);
    setFileType("");
    setConvertedFile(null);
    setProgress(0);
    setError("");
    setProgressMessage("");
    setIsProcessing(false);
    setDownloadFormat("");
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current); // Limpa o intervalo ao resetar
    }
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

        <div className="upload-container">
          <Input type="file" onChange={handleFileUpload} className="mt-4" />

          <div className="file-info mt-4">
            <p className="text-white">
              <strong>Tipos de arquivos suportados:</strong>
            </p>
            <ul className="text-white">
              <li>Imagens: JPEG, JPG, PNG, SVG, BMP, TIFF, ICO, WEBP, GIF</li>
              <li>Áudio: MP3, WAV, OGG, FLAC, M4A</li>
              <li>Documentos: PDF, DOCX</li>
            </ul>
          </div>

          {file && fileType === "image" && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(file)}
                alt="Pré-visualização"
                className="image-preview"
              />
              <p className="text-white mt-2">
                Você pode converter imagens para JPEG, PNG, SVG, BMP, TIFF, ICO,
                WEBP ou GIF.
              </p>
            </div>
          )}

          {file && fileType === "audio" && (
            <p className="text-white mt-2">
              Você pode converter áudio para MP3, WAV, OGG, FLAC ou M4A.
            </p>
          )}

          {file && fileType === "application" && file.name.endsWith(".pdf") && (
            <p className="text-white mt-2">
              Você pode converter PDFs para os seguintes formatos de imagem:
              JPEG, JPG, PNG, BMP, TIFF, GIF, WEBP.
            </p>
          )}

          {file &&
            fileType === "application" &&
            file.name.endsWith(".docx") && (
              <p className="text-white mt-2">
                Você pode converter DOCX para PDF.
              </p>
            )}
        </div>

        {file && (
          <div className="mt-6">
            {/* Botões de conversão para Imagem */}
            {fileType === "image" && (
              <>
                <Button onClick={() => handleConversion("jpeg")}>
                  Converter para JPEG
                </Button>
                <Button
                  onClick={() => handleConversion("png")}
                  className="ml-4"
                >
                  Converter para PNG
                </Button>
                <Button
                  onClick={() => handleConversion("svg")}
                  className="ml-4"
                >
                  Converter para SVG
                </Button>
                <Button
                  onClick={() => handleConversion("bmp")}
                  className="ml-4"
                >
                  Converter para BMP
                </Button>
                <Button
                  onClick={() => handleConversion("tiff")}
                  className="ml-4"
                >
                  Converter para TIFF
                </Button>
                <Button
                  onClick={() => handleConversion("ico")}
                  className="ml-4"
                >
                  Converter para ICO
                </Button>
                <Button
                  onClick={() => handleConversion("webp")}
                  className="ml-4"
                >
                  Converter para WEBP
                </Button>
                <Button
                  onClick={() => handleConversion("gif")}
                  className="ml-4"
                >
                  Converter para GIF
                </Button>
              </>
            )}

            {/* Botões de conversão para Áudio */}
            {fileType === "audio" && (
              <>
                <Button onClick={() => handleConversion("mp3")}>
                  Converter para MP3
                </Button>
                <Button
                  onClick={() => handleConversion("wav")}
                  className="ml-4"
                >
                  Converter para WAV
                </Button>
                <Button
                  onClick={() => handleConversion("ogg")}
                  className="ml-4"
                >
                  Converter para OGG
                </Button>
                <Button
                  onClick={() => handleConversion("flac")}
                  className="ml-4"
                >
                  Converter para FLAC
                </Button>
                <Button
                  onClick={() => handleConversion("m4a")}
                  className="ml-4"
                >
                  Converter para M4A
                </Button>
              </>
            )}

            {/* Botões de conversão para PDF */}
            {fileType === "application" && file.name.endsWith(".pdf") && (
              <>
                <Button onClick={() => handleConversion("jpeg")}>
                  Converter PDF para JPEG
                </Button>
                <Button
                  onClick={() => handleConversion("png")}
                  className="ml-4"
                >
                  Converter PDF para PNG
                </Button>
                <Button
                  onClick={() => handleConversion("bmp")}
                  className="ml-4"
                >
                  Converter PDF para BMP
                </Button>
                <Button
                  onClick={() => handleConversion("tiff")}
                  className="ml-4"
                >
                  Converter PDF para TIFF
                </Button>
                <Button
                  onClick={() => handleConversion("gif")}
                  className="ml-4"
                >
                  Converter PDF para GIF
                </Button>
                <Button
                  onClick={() => handleConversion("webp")}
                  className="ml-4"
                >
                  Converter PDF para WEBP
                </Button>
              </>
            )}

            {/* Botões de conversão para DOCX */}
            {fileType === "application" && file.name.endsWith(".docx") && (
              <Button onClick={() => handleConversion("pdf")} className="ml-4">
                Converter DOCX para PDF
              </Button>
            )}
          </div>
        )}

        {/* Barra de Progresso e Mensagem */}
        {isProcessing && (
          <div className="mt-4 flex flex-col items-center">
            <Progress value={progress} />
            <span className="text-white mt-2">{progressMessage}</span>
            {/* Spinner centralizado e mais visível */}
            <svg
              className="animate-spin h-8 w-8 text-white mt-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}

        {/* Link de Download */}
        {convertedFile && !isProcessing && (
          <div className="mt-6 text-center">
            <a
              href={convertedFile}
              download={`${file.name
                .split(".")
                .slice(0, -1)
                .join(".")}.${downloadFormat}`}
              className="download-link text-blue-500 underline"
            >
              Baixar Arquivo Convertido
            </a>
          </div>
        )}

        {/* Botão Resetar */}
        <div className="mt-6">
          <Button onClick={reset} className="bg-red-500">
            Resetar
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
