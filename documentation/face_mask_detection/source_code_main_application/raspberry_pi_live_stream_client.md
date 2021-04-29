User-interaction
 - Files involved:
    - ./src/templates/face_mask_detection.html
    - ./src/static/js/raspberry_pi_live_stream.js
 - The user will navigate to the face mask detection page
 - After entering a valid Raspberry Pi ID, if the Raspberry Pi is on and running the face mask detection video stream,
   a window will appear on the browser showing the video frames with detection results if any face mask is detected
 - If the user wishes to view multiple video streams, they would open a new tab on the browser and repeat the first two steps above
 - If the user wishes to view another video stream on another Raspberry Pi, they would enter a valid Pi ID in the textbox and if the Raspberry Pi
   is on and running the face mask detection program, it will show

```javascript

    PI_ID_SUBMIT.addEventListener('click', (e) => {
        e.preventDefault();
        const piIdValue = document.getElementById("raspberry-pi-id").value;
        piIdValue.trim();
        if (!piIdValue) {
            alert("Please enter a Pi ID");
        } else {
            if (prevID) {
                socket.emit(`${FACE_MASK_DETECTION_ENDPOINT}/leave`, { 'room': prevID });
                handleUserLeave();
            }
            prevID = piIdValue.trim();
            if (prevID) {
                socket.emit(`${FACE_MASK_DETECTION_ENDPOINT}/join`, { 'room': prevID });
            }
        }
    });

```

Socket I/O 
 - When a user enters a Pi ID, a socket io connection is created and allows the user to "join" a room via socket.emit(), the room is represented with the Pi ID entered
 - When a user enters a new Pi ID in the same tab, the client-side will check if the user is currently in a room. If the user is currently in a room, 
   then the socket io connection will "leave" the current room via socket.emit() and join the room with the latest Pi ID 

```javascript

    document.addEventListener("DOMContentLoaded", () => {
        socket.on('new_frame', msg => { createVideoStream(msg) });
        socket.on('join_room_msg', room_entered_msg => { handleUserJoin(room_entered_msg) });
    });

    ...
    ...

    const createVideoStream = (msg) => {
        const piId = Object.keys(msg)[0];
        const imgTag = document.getElementsByTagName("img")[0];
        imgTag.id = piId;
        imgTag.src = msg[piId];
    }

```

Video Frame Rendering
 - Every frame sent to the server from the Raspberry Pi will be processed and sent to the client via socket.emit()
 - The video frame's data, which is in base64, is rendered on the client side by populating an img tag's src