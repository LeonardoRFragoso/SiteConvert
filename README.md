# Conversor de Arquivos

Este é um projeto para conversão de arquivos entre diferentes formatos (imagens, áudio e documentos). Utiliza uma interface web construída com React e um backend em Flask para lidar com as conversões.

## Funcionalidades

- Conversão de imagens (JPEG, PNG, SVG, BMP, TIFF)
- Conversão de áudio (MP3, WAV, OGG, FLAC, AAC, WMA, M4A)
- Conversão de documentos (PDF, DOCX)
- Exibição de barra de progresso durante a conversão
- Pré-visualização de arquivos de imagem

## Tecnologias Utilizadas

### Frontend
- React
- Tailwind CSS (estilização)
- Componentes personalizados para botões, inputs e barra de progresso

### Backend
- Flask (API para conversão de arquivos)
- Biblioteca `Pillow` para manipulação de imagens
- Biblioteca `pydub` para manipulação de arquivos de áudio

## Instalação e Execução

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [Python](https://www.python.org/) instalados.

### Clonando o repositório

```bash
git clone https://github.com/LeonardoRFragoso/SiteConvert