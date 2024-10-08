from docx import Document
from fpdf import FPDF
from pdf2image import convert_from_bytes
from services.utils import generate_temp_file
import os

# Função para converter arquivos DOCX para PDF
def convert_docx_to_pdf(file):
    try:
        doc = Document(file)
        output_file = generate_temp_file('pdf')
        if output_file is None:
            return None

        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)

        # Iterar sobre os parágrafos do DOCX e adicioná-los ao PDF
        for para in doc.paragraphs:
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, para.text)

        pdf.output(output_file)
        return output_file
    except Exception as e:
        print(f"Erro ao converter DOCX para PDF: {e}")
        return None

# Função para converter PDF para imagens
def convert_pdf_to_images(file, output_format):
    try:
        # Usar pdf2image para converter o PDF para uma lista de páginas em imagens
        pages = convert_from_bytes(file.read())
        image_files = []
        for i, page in enumerate(pages):
            output_file = generate_temp_file(output_format)
            if output_file is None:
                return None

            page.save(output_file, output_format.upper())  # Salvar a página no formato solicitado
            image_files.append(output_file)
        return image_files
    except Exception as e:
        print(f"Erro ao converter PDF para imagens: {e}")
        return None
