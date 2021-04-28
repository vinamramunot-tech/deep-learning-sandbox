from flask import request
from src import app, socketio
from flask_socketio import join_room, leave_room

FACE_MASK_DETECTION_ENDPOINT = '/face_mask_detection'

@socketio.on(f'{FACE_MASK_DETECTION_ENDPOINT}/join')
def on_join(data):
    room = data['room']
    join_room(room)
    socketio.emit('join_room_msg', {'room_entered_msg': room, 'room':room}, room=room)

@socketio.on(f'{FACE_MASK_DETECTION_ENDPOINT}/leave')
def on_leave(data):
    room = data['room']
    leave_room(room)

@app.route(f'{FACE_MASK_DETECTION_ENDPOINT}/upload_frame', methods=['POST'])
def upload_frame():
    pi_dict = {}
    content = request.get_json(force=True)
    formatted_base64_image = 'data:image/png;base64,' + content['image']
    pi_id = content['id']
    pi_dict[pi_id] = formatted_base64_image
    socketio.emit('new_frame', pi_dict, room=pi_id)
    return ''
