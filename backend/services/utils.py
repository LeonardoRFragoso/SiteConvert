import os
import shutil
import uuid
from flask import session, current_app

def get_session_dir():
    session_id = session.get('session_id')
    if not session_id:
        session_id = str(uuid.uuid4())
        session['session_id'] = session_id

    session_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], session_id)
    if not os.path.exists(session_dir):
        os.makedirs(session_dir)
    return session_dir

def generate_temp_file(extension):
    session_dir = get_session_dir()
    return os.path.join(session_dir, f"{uuid.uuid4()}.{extension}")

def cleanup_session_files():
    session_dir = get_session_dir()
    if session_dir and os.path.exists(session_dir):
        shutil.rmtree(session_dir)
