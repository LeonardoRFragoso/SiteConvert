from flask import Flask
from flask_cors import CORS
from routes.audio_routes import audio_blueprint
from routes.image_routes import image_blueprint
from routes.doc_routes import doc_blueprint
from routes.cleanup_route import cleanup_blueprint
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)  # Habilitar CORS para todas as rotas

# Registro de blueprints
app.register_blueprint(audio_blueprint)
app.register_blueprint(image_blueprint)
app.register_blueprint(doc_blueprint)
app.register_blueprint(cleanup_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
