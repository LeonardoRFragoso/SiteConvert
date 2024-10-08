from pydub import AudioSegment
from services.utils import generate_temp_file

def convert_audio(file, output_format):
    try:
        audio = AudioSegment.from_file(file)
        output_file = generate_temp_file(output_format)
        if output_file is None:
            return None

        audio.export(output_file, format=output_format)
        return output_file
    except Exception as e:
        print(f"Erro ao converter áudio: {e}")
        return None
