from src import app
from flask import request
from ..services.voice_cloning import voice_cloning
from ..services.error_message_creator import create_error_message
import os
import json
import uuid

VOICE_CLONING_UPLOAD_FOLDER = 'voice_cloning_uploads'

def remove_file(upload_location):
    os.remove(upload_location)

@app.route('/voice_cloning', methods=['POST'])
def voice_cloning_controller():
    if not request.files:
        return create_error_message('No file selected'), '404'

    audio_file = request.files['audio']
    input_text = request.form['text']
    filename = request.form['filename']

    upload_location = f'{os.path.dirname(os.path.dirname(__file__))}/{VOICE_CLONING_UPLOAD_FOLDER}/{filename}_{str(uuid.uuid4())}.wav'
    audio_file.save(upload_location)
    try: 
        newAudioFileBase64 = voice_cloning(upload_location, input_text)
    except:
        return create_error_message('Audio Processing Failed'), '500'
    finally:
        remove_file(upload_location)

    return json.dumps(newAudioFileBase64), '200'