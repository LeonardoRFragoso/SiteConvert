from flask import Blueprint, jsonify
from services.utils import cleanup_session_files

# Definição do blueprint
cleanup_blueprint = Blueprint('cleanup_blueprint', __name__)

@cleanup_blueprint.route('/cleanup', methods=['POST'])
def cleanup_directory():
    """
    Endpoint para limpar arquivos temporários no diretório da sessão.
    """
    try:
        print("Iniciando a limpeza do diretório de sessão...")
        
        # Chamar a função para limpar os arquivos de sessão
        cleanup_session_files()
        
        print("Diretório da sessão limpo com sucesso.")
        return jsonify({"message": "Diretório da sessão limpo com sucesso"}), 200

    except PermissionError as e:
        # Caso de permissões insuficientes
        print(f"Erro de permissão ao limpar o diretório da sessão: {e}")
        return jsonify({"error": "Permissão insuficiente para limpar o diretório da sessão"}), 403

    except FileNotFoundError as e:
        # Caso o diretório ou arquivos não existam
        print(f"Erro: Arquivo ou diretório não encontrado durante a limpeza: {e}")
        return jsonify({"error": "Arquivo ou diretório não encontrado durante a limpeza"}), 404

    except Exception as e:
        # Logar qualquer outro erro não previsto
        print(f"Erro inesperado ao limpar o diretório da sessão: {e}")
        return jsonify({"error": f"Erro inesperado ao limpar o diretório da sessão: {e}"}), 500
