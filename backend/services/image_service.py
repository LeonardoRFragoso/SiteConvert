from PIL import Image, UnidentifiedImageError
from services.utils import generate_temp_file
import subprocess
import shutil
import os
import cairosvg

def convert_image(file, output_format):
    """
    Converte arquivos de imagem para o formato solicitado.
    Suporta arquivos SVG e formatos comuns manipulados pelo Pillow.
    """
    SUPPORTED_FORMATS = ['JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'WEBP', 'ICO']

    try:
        # Validar formato de saída
        if output_format.upper() not in SUPPORTED_FORMATS:
            raise ValueError(f"Formato {output_format} não é suportado para conversão.")

        print(f"Iniciando conversão para o formato {output_format}.")

        # Verificar se o arquivo é SVG
        if file.content_type == 'image/svg+xml':
            print("Arquivo é um SVG. Convertendo para PNG antes de continuar.")
            temp_png = generate_temp_file('png')
            if temp_png is None:
                raise RuntimeError("Erro ao criar arquivo temporário para SVG.")
            cairosvg.svg2png(file_obj=file, write_to=temp_png)
            file = temp_png

        # Carregar o arquivo como imagem com Pillow
        img = Image.open(file)

        # Corrigir transparência para JPEG
        if img.mode == 'RGBA' and output_format.upper() == 'JPEG':
            print("Convertendo RGBA para RGB para suportar JPEG.")
            img = img.convert('RGB')

        # Salvar no formato desejado
        output_file = generate_temp_file(output_format)
        if output_file is None:
            raise RuntimeError("Erro ao criar arquivo temporário para saída.")

        img.save(output_file, format=output_format.upper())
        print(f"Imagem convertida salva em {output_file}.")
        return output_file

    except UnidentifiedImageError as e:
        print(f"Erro: Arquivo fornecido não é uma imagem válida. Detalhes: {e}")
        return None
    except ValueError as e:
        print(f"Erro de validação: {e}")
        return None
    except Exception as e:
        print(f"Erro ao converter a imagem: {e}")
        return None


def convert_image_to_svg(file):
    """
    Converte imagens em tons de cinza para SVG usando o utilitário 'potrace'.
    """
    try:
        # Verificar se o utilitário 'potrace' está instalado
        if not shutil.which("potrace"):
            raise FileNotFoundError("O utilitário 'potrace' não foi encontrado no sistema.")

        print("Iniciando conversão para SVG.")
        input_image_path = generate_temp_file('pnm')
        output_svg_path = generate_temp_file('svg')

        if not input_image_path or not output_svg_path:
            raise ValueError("Erro ao criar arquivos temporários para a conversão.")

        img = Image.open(file)
        img = img.convert("L")  # Converter para tons de cinza
        img.save(input_image_path)
        print(f"Imagem temporária PNM salva em {input_image_path}.")

        # Executar o potrace para gerar o SVG
        subprocess.run(['potrace', input_image_path, '--svg', '-o', output_svg_path], check=True)
        print(f"Imagem SVG gerada e salva em {output_svg_path}.")

        # Limpeza de arquivos temporários após conversão bem-sucedida
        cleanup_temp_files([input_image_path])
        return output_svg_path

    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar o comando 'potrace': {e}")
        return None
    except FileNotFoundError as e:
        print(f"Erro ao localizar arquivos necessários: {e}")
        return None
    except Exception as e:
        print(f"Erro ao converter imagem para SVG: {e}")
        return None


def cleanup_temp_files(file_paths):
    """
    Remove arquivos temporários gerados durante o processamento.
    """
    for path in file_paths:
        try:
            if os.path.exists(path):
                os.remove(path)
                print(f"Arquivo temporário removido: {path}")
        except Exception as e:
            print(f"Erro ao remover arquivo temporário {path}: {e}")
