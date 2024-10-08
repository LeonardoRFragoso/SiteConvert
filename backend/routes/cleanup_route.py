from flask import Blueprint, jsonify
from services.utils import cleanup_session_files

# Definição do blueprint
cleanup_blueprint = Blueprint('cleanup_blueprint', __name__)

@cleanup_blueprint.route('/cleanup', methods=['POST'])
def cleanup_directory():
    try:
        # Tentativa de limpar os arquivos de sessão
        cleanup_session_files()
        return jsonify({"message": "Diretório da sessão limpo com sucesso"}), 200
    except Exception as e:
        # Logar o erro para rastreamento
        print(f"Erro ao limpar o diretório da sessão: {e}")
        return jsonify({"error": f"Erro ao limpar o diretório da sessão: {e}"}), 500
