(() => {
    const socket = io();
    const FACE_MASK_DETECTION_ENDPOINT = '/face_mask_detection';
    const PI_ID_TEXTBOX = document.getElementById("raspberry-pi-id");
    const PI_ID_SUBMIT = document.getElementById("submit-pi-id");
    let prevID = ''

    PI_ID_TEXTBOX.addEventListener('keyup', (e) => {
        if (e.code == 'Enter') {
            e.preventDefault();
            PI_ID_SUBMIT.click();
        }
    });

    PI_ID_SUBMIT.addEventListener('click', (e) => {
        e.preventDefault();
        const piIdValue = document.getElementById("raspberry-pi-id").value.trim();
        if (!piIdValue) {
            alert("Please enter a Pi ID");
            return;
        }

        socket.emit(`${FACE_MASK_DETECTION_ENDPOINT}/join`, { 'room': piIdValue });

        if (prevID) {
            socket.emit(`${FACE_MASK_DETECTION_ENDPOINT}/leave`, { 'room': prevID });
            handleUserLeave();
        }
        prevID = piIdValue;
    });

    const handleUserLeave = () => {
        const userRoomStatus = document.getElementById('user-room-status')
        if (userRoomStatus.textContent !== '') {
            userRoomStatus.textContent = '';
        }
        const imgTag = document.getElementsByTagName("img")[0];
        imgTag.removeAttribute('src');
        userRoomStatus.textContent = 'Left room: ' + prevID;
        PI_ID_TEXTBOX.value = "";
    }

    document.addEventListener("DOMContentLoaded", () => {
        socket.on('new_frame', msg => { createVideoStream(msg) });
        socket.on('join_room_msg', room_entered_msg => { handleUserJoin(room_entered_msg) });
    });

    const handleUserJoin = (room_entered_msg) => {
        const userRoomStatus = document.getElementById('user-room-status')
        if (userRoomStatus.textContent !== '') {
            userRoomStatus.textContent = '';
        }
        userRoomStatus.textContent = 'Joined room: ' + room_entered_msg['room_entered_msg']
        PI_ID_TEXTBOX.value = "";
    }

    const createVideoStream = (msg) => {
        const piId = Object.keys(msg)[0];
        const imgTag = document.getElementsByTagName("img")[0];
        imgTag.id = piId;
        imgTag.src = msg[piId];
    }
})();