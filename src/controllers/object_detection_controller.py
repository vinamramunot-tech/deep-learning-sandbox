import os
import json
from flask import request
from werkzeug.utils import secure_filename
from flask_api import status
from src import app
from ..services.media import MediaDetectionFactory
from ..services.error_message_creator import create_error_message

OBJECT_DETECTION_ENDPOINT = '/object-detection'

def get_file_extension(filename):
    return os.path.splitext(filename)[1]

@app.route(f'{OBJECT_DETECTION_ENDPOINT}/detect', methods=['POST'])
def upload_image_file():
    if not request.files:
        return create_error_message('No file selected'), status.HTTP_400_BAD_REQUEST

    uploaded_file = request.files['file']
    detection_mode = request.form['detection_mode']
    yolo_threshold = request.form['yolo_threshold']
    filename = secure_filename(uploaded_file.filename)
    media = MediaDetectionFactory().create_instance(int(detection_mode))
    if filename and get_file_extension(filename) not in media.get_extensions():
        message = f'File type must be {", ".join(media.get_extensions())}'
        return create_error_message(message), status.HTTP_400_BAD_REQUEST

    upload_location = os.path.join(media.get_upload_path(), filename)
    uploaded_file.save(upload_location)

    media_object = {
        'media': media.create(filename, yolo_threshold),
        'type': media.get_type(),
    }

    os.remove(upload_location)
    
    return json.dumps(media_object), status.HTTP_200_OK
