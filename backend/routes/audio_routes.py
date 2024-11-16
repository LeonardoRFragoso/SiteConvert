import os
from flask import Blueprint, request, jsonify, send_file
from services.audio_service import convert_audio
from services.utils import cleanup_session_files

# Definição do blueprint
audio_blueprint = Blueprint('audio_blueprint', __name__)

@audio_blueprint.route('/convert/audio', methods=['POST'])
def convert_audio_route():
    """
    Endpoint para converter arquivos de áudio para formatos suportados.
    """
    try:
        # Verificar se o arquivo foi enviado
        if 'file' not in request.files:
            print("Nenhum arquivo foi enviado.")
            return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

        file = request.files['file']
        output_format = request.form.get('format', '').lower()

        # Verificar se o formato solicitado é suportado
        SUPPORTED_FORMATS = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a']
        if output_format not in SUPPORTED_FORMATS:
            print(f"Formato de áudio '{output_format}' não suportado.")
            return jsonify({"error": f"Formato '{output_format}' não é suportado"}), 400

        print(f"Iniciando conversão do arquivo de áudio para o formato {output_format}.")
        
        # Converter o arquivo de áudio
        converted_file = convert_audio(file, output_format)

        # Verificar se a conversão foi bem-sucedida
        if not converted_file or not os.path.exists(converted_file):
            print("Erro ao processar o arquivo de áudio.")
            return jsonify({"error": "Erro ao processar o arquivo de áudio"}), 500

        print(f"Arquivo convertido salvo em: {converted_file}")

        # Enviar o arquivo convertido como resposta
        abs_path = os.path.abspath(converted_file)
        response = send_file(
            abs_path,
            as_attachment=True,
            download_name=f"arquivo_convertido.{output_format}"
        )

        # Limpar arquivos temporários
        cleanup_session_files()
        print("Arquivos temporários limpos após conversão de áudio.")
        return response

    except FileNotFoundError as e:
        print(f"Erro: Arquivo não encontrado durante a conversão: {e}")
        return jsonify({"error": "Arquivo não encontrado durante a conversão"}), 404

    except ValueError as e:
        print(f"Erro de validação: {e}")
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        print(f"Erro inesperado ao processar o arquivo de áudio: {e}")
        return jsonify({"error": f"Erro inesperado ao processar o arquivo: {e}"}), 500
