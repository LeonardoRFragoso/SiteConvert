import os
from flask import Blueprint, request, jsonify, send_file
from services.image_service import convert_image, convert_image_to_svg
from services.utils import cleanup_session_files

# Definição do blueprint
image_blueprint = Blueprint('image_blueprint', __name__)

@image_blueprint.route('/convert/image', methods=['POST'])
def convert_image_route():
    # Verificar se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

    file = request.files['file']
    output_format = request.form.get('format').lower()

    # Verificar se o formato solicitado é suportado
    if output_format not in ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'ico', 'svg']:
        return jsonify({"error": "Formato de imagem não suportado"}), 400

    # Converter a imagem de acordo com o formato solicitado
    try:
        if output_format == 'svg':
            converted_file = convert_image_to_svg(file)
        else:
            converted_file = convert_image(file, output_format)
        
        # Verificar se a conversão foi bem-sucedida
        if converted_file is None or not os.path.exists(converted_file):
            return jsonify({"error": "Erro ao processar o arquivo de imagem"}), 500

        # Enviar o arquivo convertido
        abs_path = os.path.abspath(converted_file)
        response = send_file(abs_path, as_attachment=True, download_name=f"arquivo_convertido.{output_format}")
        
        # Limpar arquivos temporários após a resposta
        cleanup_session_files()
        return response
    
    except Exception as e:
        # Logar o erro para ajudar no rastreamento
        print(f"Erro ao enviar o arquivo convertido: {e}")
        return jsonify({"error": "Erro ao enviar o arquivo convertido"}), 500
