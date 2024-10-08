from PIL import Image, UnidentifiedImageError
from services.utils import generate_temp_file
import subprocess

def convert_image(file, output_format):
    try:
        img = Image.open(file)
        output_file = generate_temp_file(output_format)
        if output_file is None:
            return None

        img.save(output_file, format=output_format.upper())
        return output_file
    except UnidentifiedImageError as e:
        print(f"Erro ao abrir a imagem: {e}")
        return None
    except Exception as e:
        print(f"Erro ao converter a imagem: {e}")
        return None

def convert_image_to_svg(file):
    try:
        input_image_path = generate_temp_file('pnm')
        img = Image.open(file)
        img = img.convert("L")
        img.save(input_image_path)

        output_svg_path = generate_temp_file('svg')
        subprocess.run(['potrace', input_image_path, '--svg', '-o', output_svg_path], check=True)

        return output_svg_path
    except Exception as e:
        print(f"Erro ao converter imagem para SVG: {e}")
        return None
