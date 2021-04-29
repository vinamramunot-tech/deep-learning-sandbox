import os
import shutil
from pathlib import Path
from flask import Flask

app = Flask('src')
app.config['BASE_PATH'] =  os.path.abspath(os.path.dirname(__file__))
app.config['FACE_DETECTION_WEIGHTS_PATH'] = os.path.join(app.config['BASE_PATH'], 'face_detection_weights')
UPLOAD_PATH = os.path.join(app.config['BASE_PATH'], 'uploads')
app.config['IMAGE_UPLOAD_PATH'] = os.path.join(UPLOAD_PATH, 'images')
app.config['VIDEO_UPLOAD_PATH'] = os.path.join(UPLOAD_PATH, 'videos')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from flask_socketio import SocketIO
from src.services.socketio_async_mode_retriever import retrieve
socketio = SocketIO(app, async_mode=retrieve())

from src.services.server_protocol import get_server_ip, get_server_port
server_ip = get_server_ip()
server_port = get_server_port()

def create_path_if_it_does_not_exist(path):
    Path(path).mkdir(parents=True, exist_ok=True)
create_path_if_it_does_not_exist(app.config['IMAGE_UPLOAD_PATH'])
create_path_if_it_does_not_exist(app.config['VIDEO_UPLOAD_PATH'])

def create_path_for_voice_cloning_uploads(path):
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path)
create_path_for_voice_cloning_uploads('src/voice_cloning_uploads')

def create_case_insensitive_extensions(extensions):
    to_lower = lambda x: x.lower()
    to_upper = lambda x: x.upper()
    return [f(x) for x in extensions for f in (to_lower, to_upper)]

app.config['IMAGE_EXTENSIONS'] = create_case_insensitive_extensions(['.jpg', '.jpeg', '.png', '.gif'])
app.config['VIDEO_EXTENSIONS'] = create_case_insensitive_extensions(['.mp4'])

# pylint: disable=wrong-import-position
from src.yolo import *
from src.controllers import *
from src.services import *
