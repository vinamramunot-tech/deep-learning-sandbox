Server side internals

 - This code is from ./src/controllers/face_mask_detection_controller.py and communicates with the client-side code ./src/static/js/raspberry_pi_live_stream.js
 - Data is sent to this server from the Face Mask Detection repository. The file responsible for sending data to this server is ./services/detection_runner.py (From the Face Mask Detection Repository)

```python3

@socketio.on(f'{FACE_MASK_DETECTION_ENDPOINT}/join')
def on_join(data):
    room = data['room']
    join_room(room)
    socketio.emit('join_room_msg', {'room_entered_msg': room, 'room':room}, room=room)

@socketio.on(f'{FACE_MASK_DETECTION_ENDPOINT}/leave')
def on_leave(data):
    room = data['room']
    leave_room(room)

```

Joining / Leaving a room 
 - When a user enters a room, the client emits a message via socket.emit() and the server receives this message.
 - This allows the user to join a room (based on Pi ID) 
 - When a user leaves a room, the client emits a message via socket.emit() and the server receives this message.
 - This allows the user to leave a room (based on Pi ID) 

 ```python3

@app.route(f'{FACE_MASK_DETECTION_ENDPOINT}/upload_frame', methods=['POST'])
def upload_frame():
    pi_dict = {}
    content = request.get_json(force=True)
    formatted_base64_image = 'data:image/png;base64,' + content['image']
    pi_id = content['id']
    pi_dict[pi_id] = formatted_base64_image
    socketio.emit('new_frame', pi_dict, room=pi_id)
    return ''

 ```

 Handling incoming frames from Raspberry Pi 
  - When the Raspberry Pi makes a POST request to the server, sending in the Raspberry Pi and the detected frame (in base64),
    the server handles this by retrieving the json value of the content via request.get_json() and appends 'data:image/png;base64,' to the data so that
    the img tag's src can render it properly
  - socketio.emit() is called to emit to a specific room (pi_id), with the base64 frame data passed in
  - socketio rooms are used here to group users in a subset, so that messages are sent to and from specific rooms instead of sent to everyone. This keeps the Raspberry Pi video stream requested from the user exclusive to only the user who requested the video stream.

