import os

class Config:
    SECRET_KEY = 'supersecretkey'
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
