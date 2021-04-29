```python3
import requests
import base64
import imutils
import time
import cv2
from services.mask_detector import detect
from services.environment.domain import create_endpoint
from services.environment.raspberry_pi_id import get_raspberry_pi_id
from services.environment.detections_per_second import get_time_threshold_in_seconds

def run(videoStream, faceNet, maskNet, confidenceThreshold):
    HAS_MASK_COLOR_BGR = (0, 255, 0) # Green
    HAS_MASK_TEXT = "Mask"
    DOESNT_HAVE_MASK_COLOR_BGR = (0, 0, 255) # Red
    DOESNT_HAVE_MASK_TEXT = "No Mask"

    TIME_THRESHOLD_SECONDS = get_time_threshold_in_seconds()

    FRAME_UPLOAD_ENDPOINT = create_endpoint('/face_mask_detection/upload_frame')
    RASPBERRY_PI_ID = get_raspberry_pi_id()
    start_time = time.time()
    boxes = []
    
    while True:
        frame = videoStream.read()
        new_time = time.time()
        time_elapsed = new_time - start_time

        if time_elapsed > TIME_THRESHOLD_SECONDS:
            (faceLocations, predictions) = detect(frame, faceNet, maskNet, confidenceThreshold)

            boxes.clear()
            for (boundingBox, prediction) in zip(faceLocations, predictions):
                    (startX, startY, endX, endY) = boundingBox
                    (mask, withoutMask) = prediction

                    label = HAS_MASK_TEXT if mask > withoutMask else DOESNT_HAVE_MASK_TEXT
                    color = HAS_MASK_COLOR_BGR if label == HAS_MASK_TEXT else DOESNT_HAVE_MASK_COLOR_BGR
                    label = "{}: {:.2f}%".format(label, max(mask, withoutMask) * 100)

                    boxes.append({
                        'label': label, 
                        'startX': startX,
                        'startY': startY,
                        'color': color,
                        'endX': endX, 
                        'endY': endY
                    })
            start_time = new_time

            if boxes:
                for box in boxes:
                    cv2.putText(
                        frame, 
                        box['label'], 
                        (box['startX'], box['startY'] - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.45, 
                        box['color'],
                        2
                    )   
                    cv2.rectangle(frame, (box['startX'], box['startY']), (box['endX'], box['endY']), box['color'], 2)

            _, buffer = cv2.imencode('.png', frame)
            b64_img = base64.b64encode(buffer)
            requests.post(FRAME_UPLOAD_ENDPOINT, json={'image':b64_img, 'id':RASPBERRY_PI_ID})
```

- ./services/detection_runner.py is responsible for reading information from the video stream and calling the detect() function (further discussed in mask_detector.md).

- This file also makes the POST request to the server, with the detected image data and a Raspberry Pi ID passed in. The Raspberry Pi ID is from the .env file, this is user-defined and can be referenced in env_example.txt

- run() takes videoStream, faceNet, maskNet, and confidenceThreshold as parameters and sets the default labels ("Mask" or "No Mask") for the detected frame.

- TIME_THRESHOLD_SECONDS determines the time threshold for each detected frame, we retrieve this from get_time_threshold_in_seconds() which is defined in services/environment/detections_per_second.py

- FRAME_UPLOAD_ENDPOINT determinds the endpoint to send the POST request, we retireve this from create_endpoint() which is defined in services/environment/domain/create_endpoint.py

- RASPBERRY_PI_ID retrieve the user-defined Pi ID, we retrieve this value from get_raspberry_pi_id() which is defined in services/environment/raspberry_pi_id.py

- run() loops through each video frame and calculates the elapsed time, it checks if the time elapsed is greater than the TIME_THRESHOLD_SECONDS. If it is greater, we perform the detection via detect() which returns the face locations and prediction score. The bounding boxes are cleared after each detection.

- After getting the detection results, the bounding box is created using the results returned from detect(). There are additional checks to see if the prediction contains our labels ("Mask" or "No Mask")

- After the bounding box is created and appended to the frame, the frame is encoded to a .png

- The base64 data of the .png is sent to the endpoint (FRAME_UPLOAD_ENDPOINT) along with the Pi ID (RASPBERRY_PI_ID)