import os
from flask import Blueprint, request, jsonify, send_file
from services.doc_service import convert_docx_to_pdf, convert_pdf_to_images
from services.utils import cleanup_session_files

# Definição do blueprint
doc_blueprint = Blueprint('doc_blueprint', __name__)

# Rota para conversão de DOCX para PDF
@doc_blueprint.route('/convert/docx_to_pdf', methods=['POST'])
def convert_docx_route():
    # Verificar se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

    file = request.files['file']

    try:
        # Tentar converter o DOCX para PDF
        converted_file = convert_docx_to_pdf(file)

        # Verificar se a conversão foi bem-sucedida
        if converted_file is None or not os.path.exists(converted_file):
            return jsonify({"error": "Erro ao processar o arquivo DOCX"}), 500

        # Enviar o arquivo convertido como resposta
        abs_path = os.path.abspath(converted_file)
        response = send_file(abs_path, as_attachment=True, download_name="arquivo_convertido.pdf")
        
        # Limpar arquivos temporários
        cleanup_session_files()
        return response
    
    except Exception as e:
        # Logar o erro para rastreamento
        print(f"Erro ao enviar o arquivo convertido: {e}")
        return jsonify({"error": f"Erro ao enviar o arquivo convertido: {e}"}), 500

# Rota para conversão de PDF para imagens
@doc_blueprint.route('/convert/pdf_to_images', methods=['POST'])
def convert_pdf_route():
    # Verificar se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

    file = request.files['file']
    output_format = request.form.get('format').lower()

    # Verificar se o formato de saída solicitado é suportado
    if output_format not in ['png', 'jpeg', 'tiff', 'bmp']:
        return jsonify({"error": "Formato de imagem para conversão de PDF não suportado"}), 400

    try:
        # Converter o PDF em imagens
        converted_files = convert_pdf_to_images(file, output_format)

        # Verificar se a conversão foi bem-sucedida
        if converted_files is None or not all(os.path.exists(f) for f in converted_files):
            return jsonify({"error": "Erro ao processar o arquivo PDF"}), 500

        # Enviar a primeira página convertida como imagem
        abs_path = os.path.abspath(converted_files[0])
        response = send_file(abs_path, as_attachment=True, download_name=f"pdf_page_1.{output_format}")

        # Limpar arquivos temporários
        cleanup_session_files()
        return response
    
    except Exception as e:
        # Logar o erro para rastreamento
        print(f"Erro ao enviar o arquivo convertido: {e}")
        return jsonify({"error": f"Erro ao enviar o arquivo convertido: {e}"}), 500
