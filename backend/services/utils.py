import os
import shutil
import uuid
from flask import session, current_app

def get_session_dir():
    """
    Obtém o diretório associado à sessão do usuário. 
    Cria o diretório se ele não existir.

    :return: Caminho do diretório da sessão.
    """
    try:
        # Obter ou gerar um ID único para a sessão
        session_id = session.get('session_id')
        if not session_id:
            session_id = str(uuid.uuid4())
            session['session_id'] = session_id

        # Caminho completo do diretório da sessão
        session_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], session_id)

        # Criar o diretório da sessão, se necessário
        if not os.path.exists(session_dir):
            os.makedirs(session_dir)
            print(f"Diretório da sessão criado: {session_dir}")

        return session_dir

    except Exception as e:
        print(f"Erro ao obter ou criar o diretório da sessão: {e}")
        return None


def generate_temp_file(extension):
    """
    Gera um arquivo temporário no diretório da sessão com a extensão especificada.

    :param extension: Extensão do arquivo (e.g., 'jpg', 'mp3').
    :return: Caminho completo do arquivo temporário.
    """
    try:
        session_dir = get_session_dir()
        if not session_dir:
            raise RuntimeError("Erro ao acessar o diretório da sessão.")

        # Gerar um nome único para o arquivo
        temp_file = os.path.join(session_dir, f"{uuid.uuid4()}.{extension}")
        print(f"Arquivo temporário gerado: {temp_file}")
        return temp_file

    except Exception as e:
        print(f"Erro ao gerar arquivo temporário: {e}")
        return None


def cleanup_session_files():
    """
    Remove todos os arquivos e diretórios associados à sessão do usuário.
    """
    try:
        session_dir = get_session_dir()
        if session_dir and os.path.exists(session_dir):
            shutil.rmtree(session_dir)
            print(f"Arquivos temporários removidos do diretório da sessão: {session_dir}")
        else:
            print(f"Nenhum diretório de sessão encontrado para limpeza: {session_dir}")

    except Exception as e:
        print(f"Erro ao limpar arquivos de sessão: {e}")
