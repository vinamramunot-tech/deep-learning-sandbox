```python3
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from imutils.video import VideoStream
import numpy as np
import cv2

def detect(frame, faceNet, maskNet, confidenceThreshold):
	(h, w) = frame.shape[:2]

	blob = cv2.dnn.blobFromImage(
		frame,
		1.0, 
		(300, 300),
		(104.0, 177.0, 123.0)
	)
	faceNet.setInput(blob)
	detections = faceNet.forward()

	faces = []
	faceLocations = []
	predictions = []
	for i in range(0, detections.shape[2]):
		confidence = detections[0, 0, i, 2]

		if confidence > confidenceThreshold:
			boundingBoxCoordinates = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
			(startX, startY, endX, endY) = boundingBoxCoordinates.astype("int")

			(startX, startY) = (max(0, startX), max(0, startY))
			(endX, endY) = (min(w - 1, endX), min(h - 1, endY))

			face = frame[startY:endY, startX:endX]
			face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
			face = cv2.resize(face, (224, 224))
			face = img_to_array(face)
			face = preprocess_input(face)

			faces.append(face)
			faceLocations.append((startX, startY, endX, endY))

	if len(faces) > 0:
		predictions = maskNet.predict(np.array(faces, dtype="float32"), batch_size=32)

	return (faceLocations, predictions)

```

- ./services/mask_detector.py is responsible for performing the actual detection, using the video frame, faceNet, maskNet, and confidenceThreshold.
- The height and width is calculated from the frame and the blob data is calculated from cv2.dnn.blobFromImage(), which takes in the video frame data.
- blob is passed in faceNet.setInput() and detections are retrieved from faceNet.forward()
- The faces, face locations, and predictions are determined during a for-loop through the detections
- If the confidence is higher than the confidence threshold, bounding box coordinates and facial dimensions are created. 
- If there is a valid detected face, then the predictions are retrieved through maskNet.predict(), with the faces passed in
- detect() returns faceLocations and predictions which will be used in detection_runner.py (refer to detection_runner.md)