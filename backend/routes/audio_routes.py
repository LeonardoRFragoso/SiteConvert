import os
from flask import Blueprint, request, jsonify, send_file
from services.audio_service import convert_audio
from services.utils import cleanup_session_files

# Definição do blueprint
audio_blueprint = Blueprint('audio_blueprint', __name__)

@audio_blueprint.route('/convert/audio', methods=['POST'])
def convert_audio_route():
    # Verificar se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

    file = request.files['file']
    output_format = request.form.get('format').lower()

    # Verificar se o formato solicitado é suportado
    if output_format not in ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a']:
        return jsonify({"error": "Formato de áudio não suportado"}), 400

    try:
        # Converter o arquivo de áudio
        converted_file = convert_audio(file, output_format)

        # Verificar se a conversão foi bem-sucedida
        if converted_file is None or not os.path.exists(converted_file):
            return jsonify({"error": "Erro ao processar o arquivo de áudio"}), 500

        # Enviar o arquivo convertido como resposta
        abs_path = os.path.abspath(converted_file)
        response = send_file(abs_path, as_attachment=True, download_name=f"arquivo_convertido.{output_format}")

        # Limpar arquivos temporários
        cleanup_session_files()
        return response
    
    except Exception as e:
        # Logar o erro para rastreamento
        print(f"Erro ao enviar o arquivo convertido: {e}")
        return jsonify({"error": f"Erro ao enviar o arquivo convertido: {e}"}), 500
