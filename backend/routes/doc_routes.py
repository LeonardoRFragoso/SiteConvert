import os
from flask import Blueprint, request, jsonify, send_file
from services.doc_service import convert_docx_to_pdf, convert_pdf_to_images
from services.utils import cleanup_session_files

# Definição do blueprint
doc_blueprint = Blueprint('doc_blueprint', __name__)

# Rota para conversão de DOCX para PDF
@doc_blueprint.route('/convert/docx_to_pdf', methods=['POST'])
def convert_docx_route():
    """
    Converte um arquivo DOCX para PDF.
    """
    try:
        # Verificar se o arquivo foi enviado
        if 'file' not in request.files:
            print("Nenhum arquivo foi enviado.")
            return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

        file = request.files['file']

        # Tentar converter o DOCX para PDF
        print("Iniciando conversão de DOCX para PDF.")
        converted_file = convert_docx_to_pdf(file)

        # Verificar se a conversão foi bem-sucedida
        if not converted_file or not os.path.exists(converted_file):
            print("Erro ao processar o arquivo DOCX.")
            return jsonify({"error": "Erro ao processar o arquivo DOCX"}), 500

        print(f"Arquivo convertido salvo em: {converted_file}")

        # Enviar o arquivo convertido como resposta
        abs_path = os.path.abspath(converted_file)
        response = send_file(
            abs_path,
            as_attachment=True,
            download_name="arquivo_convertido.pdf"
        )

        # Limpar arquivos temporários
        cleanup_session_files()
        print("Arquivos temporários limpos após conversão de DOCX para PDF.")
        return response

    except FileNotFoundError as e:
        print(f"Erro de arquivo: {e}")
        return jsonify({"error": f"Arquivo não encontrado: {e}"}), 500

    except RuntimeError as e:
        print(f"Erro crítico: {e}")
        return jsonify({"error": f"Erro crítico ao processar o arquivo DOCX: {e}"}), 500

    except Exception as e:
        print(f"Erro inesperado ao processar o DOCX: {e}")
        return jsonify({"error": f"Erro inesperado ao processar o DOCX: {e}"}), 500


# Rota para conversão de PDF para imagens
@doc_blueprint.route('/convert/pdf_to_images', methods=['POST'])
def convert_pdf_route():
    """
    Converte um arquivo PDF em imagens nos formatos suportados (PNG, JPEG, TIFF, BMP).
    """
    try:
        # Verificar se o arquivo foi enviado
        if 'file' not in request.files:
            print("Nenhum arquivo foi enviado.")
            return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

        file = request.files['file']
        output_format = request.form.get('format', '').lower()

        # Verificar se o formato de saída solicitado é suportado
        SUPPORTED_FORMATS = ['png', 'jpeg', 'tiff', 'bmp']
        if output_format not in SUPPORTED_FORMATS:
            print(f"Formato de saída '{output_format}' não suportado para conversão de PDF.")
            return jsonify({
                "error": f"Formato '{output_format}' não é suportado. "
                         f"Formatos válidos: {', '.join(SUPPORTED_FORMATS)}"
            }), 400

        print("Iniciando conversão de PDF para imagens.")
        # Converter o PDF em imagens
        converted_files = convert_pdf_to_images(file, output_format)

        # Verificar se a conversão foi bem-sucedida
        if not converted_files or not all(os.path.exists(f) for f in converted_files):
            print("Erro ao processar o arquivo PDF.")
            return jsonify({"error": "Erro ao processar o arquivo PDF"}), 500

        print(f"Primeira página convertida salva em: {converted_files[0]}")

        # Enviar a primeira página convertida como imagem
        abs_path = os.path.abspath(converted_files[0])
        response = send_file(
            abs_path,
            as_attachment=True,
            download_name=f"pdf_page_1.{output_format}"
        )

        # Limpar arquivos temporários
        cleanup_session_files()
        print("Arquivos temporários limpos após conversão de PDF para imagens.")
        return response

    except FileNotFoundError as e:
        print(f"Erro de arquivo: {e}")
        return jsonify({"error": f"Arquivo não encontrado: {e}"}), 500

    except ValueError as e:
        print(f"Erro de validação: {e}")
        return jsonify({"error": str(e)}), 400

    except RuntimeError as e:
        print(f"Erro crítico: {e}")
        return jsonify({"error": f"Erro crítico ao processar o PDF: {e}"}), 500

    except Exception as e:
        print(f"Erro inesperado ao processar o PDF: {e}")
        return jsonify({"error": f"Erro inesperado ao processar o PDF: {e}"}), 500
