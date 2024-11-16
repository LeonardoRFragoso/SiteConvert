import os
from flask import Blueprint, request, jsonify, send_file
from services.image_service import convert_image, convert_image_to_svg
from services.utils import cleanup_session_files

# Definição do blueprint
image_blueprint = Blueprint('image_blueprint', __name__)

@image_blueprint.route('/convert/image', methods=['POST'])
def convert_image_route():
    try:
        # Verificar se o arquivo foi enviado
        if 'file' not in request.files:
            print("Nenhum arquivo foi enviado")
            return jsonify({"error": "Nenhum arquivo foi enviado"}), 400

        file = request.files['file']
        output_format = request.form.get('format')

        if not output_format:
            print("Formato de imagem não foi enviado")
            return jsonify({"error": "Formato de imagem não foi enviado"}), 400

        output_format = output_format.lower()

        # Verificar se o formato solicitado é suportado
        SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'ico', 'svg']
        if output_format not in SUPPORTED_FORMATS:
            print(f"Formato de imagem não suportado: {output_format}")
            return jsonify({"error": f"Formato de imagem '{output_format}' não é suportado"}), 400

        print(f"Recebido arquivo: {file.filename} para conversão em {output_format}")

        # Converter a imagem de acordo com o formato solicitado
        if output_format == 'svg':
            converted_file = convert_image_to_svg(file)
        else:
            converted_file = convert_image(file, output_format)

        # Verificar se a conversão foi bem-sucedida
        if converted_file is None or not os.path.exists(converted_file):
            print("Erro ao processar o arquivo de imagem")
            return jsonify({"error": "Erro ao processar o arquivo de imagem"}), 500

        print(f"Arquivo convertido salvo em: {converted_file}")

        # Enviar o arquivo convertido
        abs_path = os.path.abspath(converted_file)
        response = send_file(
            abs_path,
            as_attachment=True,
            download_name=f"arquivo_convertido.{output_format}"
        )
        print(f"Arquivo enviado com sucesso: {abs_path}")

        # Limpar arquivos temporários após a resposta
        cleanup_session_files()
        print("Arquivos temporários limpos")

        return response

    except FileNotFoundError as e:
        # Erros relacionados a arquivos não encontrados ou problemas no sistema de arquivos
        print(f"Erro ao acessar arquivo: {e}")
        return jsonify({"error": "Erro ao acessar arquivo no servidor"}), 500

    except UnidentifiedImageError as e:
        # Erros relacionados à abertura de arquivos inválidos
        print(f"O arquivo enviado não é uma imagem válida: {e}")
        return jsonify({"error": "O arquivo enviado não é uma imagem válida."}), 400

    except Exception as e:
        # Logar o erro para ajudar no rastreamento
        print(f"Erro ao processar a requisição: {str(e)}")
        return jsonify({"error": "Erro ao processar a requisição"}), 500
