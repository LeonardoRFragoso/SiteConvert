from docx import Document
from fpdf import FPDF
from pdf2image import convert_from_bytes
from services.utils import generate_temp_file
import os

# Função para converter arquivos DOCX para PDF
def convert_docx_to_pdf(file):
    """
    Converte um arquivo DOCX para PDF.
    
    :param file: Arquivo DOCX enviado.
    :return: Caminho do arquivo PDF convertido ou None em caso de erro.
    """
    try:
        # Abrir o arquivo DOCX
        doc = Document(file)
        output_file = generate_temp_file('pdf')

        if output_file is None:
            raise RuntimeError("Erro ao criar arquivo temporário para saída em PDF.")

        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)

        # Iterar sobre os parágrafos do DOCX e adicioná-los ao PDF
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        for para in doc.paragraphs:
            if para.text.strip():  # Ignorar linhas em branco
                pdf.multi_cell(0, 10, para.text)

        pdf.output(output_file)
        print(f"Conversão de DOCX para PDF concluída. Arquivo salvo em {output_file}.")
        return output_file

    except FileNotFoundError as e:
        print(f"Erro: Arquivo DOCX não encontrado. Detalhes: {e}")
        return None
    except RuntimeError as e:
        print(f"Erro crítico: {e}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao converter DOCX para PDF: {e}")
        return None


# Função para converter PDF para imagens
def convert_pdf_to_images(file, output_format):
    """
    Converte um arquivo PDF em uma lista de imagens nos formatos suportados.
    
    :param file: Arquivo PDF enviado.
    :param output_format: Formato de saída das imagens (e.g., 'JPEG', 'PNG').
    :return: Lista de caminhos para as imagens geradas ou None em caso de erro.
    """
    try:
        # Validação do formato de saída
        SUPPORTED_FORMATS = ['JPEG', 'PNG', 'TIFF', 'BMP']
        if output_format.upper() not in SUPPORTED_FORMATS:
            raise ValueError(f"Formato '{output_format}' não é suportado para conversão de PDF. "
                             f"Formatos válidos: {', '.join(SUPPORTED_FORMATS)}")

        print(f"Iniciando conversão de PDF para imagens no formato {output_format}.")
        
        # Converter PDF para imagens
        pages = convert_from_bytes(file.read())
        image_files = []

        for i, page in enumerate(pages):
            output_file = generate_temp_file(output_format)
            if output_file is None:
                raise RuntimeError(f"Erro ao criar arquivo temporário para saída da página {i+1}.")

            # Salvar a página convertida no formato solicitado
            page.save(output_file, output_format.upper())
            image_files.append(output_file)
            print(f"Página {i+1} salva em {output_file}.")

        print(f"Conversão de PDF para imagens concluída. Total de {len(image_files)} página(s) convertida(s).")
        return image_files

    except FileNotFoundError as e:
        print(f"Erro: Arquivo PDF não encontrado. Detalhes: {e}")
        return None
    except ValueError as e:
        print(f"Erro de validação: {e}")
        return None
    except RuntimeError as e:
        print(f"Erro crítico: {e}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao converter PDF para imagens: {e}")
        return None
