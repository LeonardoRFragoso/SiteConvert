from pydub import AudioSegment
from services.utils import generate_temp_file

def convert_audio(file, output_format):
    """
    Converte um arquivo de áudio para o formato solicitado.

    :param file: Arquivo de áudio enviado.
    :param output_format: Formato de saída desejado (e.g., 'mp3', 'wav').
    :return: Caminho para o arquivo convertido ou None em caso de erro.
    """
    try:
        # Verificar formatos suportados pelo pydub
        SUPPORTED_FORMATS = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a']
        if output_format.lower() not in SUPPORTED_FORMATS:
            raise ValueError(f"Formato de saída '{output_format}' não é suportado para conversão de áudio.")

        # Carregar o arquivo de áudio
        print("Carregando o arquivo de áudio...")
        audio = AudioSegment.from_file(file)

        # Criar arquivo temporário para saída
        output_file = generate_temp_file(output_format)
        if output_file is None:
            raise RuntimeError("Erro ao criar arquivo temporário para saída.")

        # Exportar o arquivo no formato solicitado
        print(f"Exportando áudio para o formato {output_format}...")
        audio.export(output_file, format=output_format.lower())
        print(f"Áudio convertido salvo em {output_file}.")
        return output_file

    except ValueError as e:
        print(f"Erro de validação: {e}")
        return None
    except FileNotFoundError as e:
        print(f"Erro de arquivo: {e}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao converter áudio: {e}")
        return None
