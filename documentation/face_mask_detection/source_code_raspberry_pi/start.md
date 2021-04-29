```python3 
import argparse
from imutils.video import VideoStream
import cv2
from tensorflow.keras.models import load_model
from services.detection_runner import run
from os import path
import time
from services.environment.resolution import get_camera_resolution
from services.environment.frame_rate import get_camera_frame_rate
from services.environment.confidence_threshold import get_confidence_threshold

face_detector_path = "face_detector"
model_path = "mask_detector.model"

print("[INFO] loading face detector model...")
prototxtPath = path.join(face_detector_path, "deploy.prototxt")
weightsPath = path.join(face_detector_path, "res10_300x300_ssd_iter_140000.caffemodel")
faceNet = cv2.dnn.readNet(prototxtPath, weightsPath)

print("[INFO] loading face mask detector model...")
maskNet = load_model(model_path)

print("[INFO] starting video stream...")
vs = VideoStream(src=0, usePiCamera=True, framerate=get_camera_frame_rate(), resolution=get_camera_resolution()).start()
time.sleep(2.0) # allow the camera sensor to warm up

run(vs, faceNet, maskNet, get_confidence_threshold())
```

- This code is from ./app.py (Face Mask Detection Repository)

- This is the code that loads all the required models, weights, and confidence thresholds for starting the face mask detection program

	- maskNet is the model that is loaded using load_model(model_path), where model_path is the "mask_detector.model" 

- Additionally, it also sets the frame rate and resolution for the video stream

	- The video stream is set using VideoStream(src=0, usePiCamera=True, framerate=get_camera_frame_rate(), resolution=get_camera_resolution()).start() and allows a 2 second sleep to allow the PiCamera to warm up

- run() is called with the video stream, faceNet, maskNet, and confidence threshold passed in.

	- run() is from services.detection_runner, which is responsible for performing the face mask detection (further discussed in detection_runner.md)