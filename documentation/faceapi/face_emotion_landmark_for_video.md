# Related Files

1. src/static/templates/face_emotion_landmark_for_video.html
2. src/static/js/face_emotion_landmark_for_video.js
3. src/static/js/face-api.min.js
4. src/static/face-api-models/tiny_face_detector_model-weights_manifest.json
5. src/static/face-api-models/face_landmark_68_model-weights_manifest.json
6. src/static/face-api-models/face_recognition_model-weights_manifest.json
7. src/static/face-api-models/face_expression_model-weights_manifest.json
8. src/static/face-api-models/tiny_face_detector_model-shard1
9. src/static/face-api-models/face_landmark_68_model-shard1
10. src/static/face-api-models/face_recognition_model-shard1
11. src/static/face-api-models/face_recognition_model-shard2
12. src/static/face-api-models/face_expression_model-shard1

# Face Emotion and Landmark for video

1. User navigates to face-recognition for webcam page
2. All of the required models (tinyFaceDetector, faceLandmark68Net, faceRecognitionNet, faceExpressionNet) are loaded
3. User clicks on "Detect" button with a custom or default threshold setting
4. The submit event listener is fired and a video stream via webcam plays on the page
5. The video element plays the event listener to create a canvas using `faceapi.createCanvasFromMedia(videoObject)`
6. The canvas overlays on a output div container using `outputContainer.appendChild(canvas)`
7. `threshold` variable is created and its value comes from the input field
8. We set the `outputContainer` width and height that we get in step six
9. The `outputContainer` is appended to the `canvas`
10. `faceapi.matchDimensions` is used to resize the media elements
11. A call to `drawFaceDetection()` is made asynchronously to continously perform the face recognition with labeled training data loaded earlier. This function retrieves detection data by calling `faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions()` to show facial landmarks + labels + score. The results are passed to `faceapi.resizeResults(detections, displaySize)` to be resized according to the display size. `drawDetections()` method is called to draw detections on the resized `canvas`. Similarly, `drawFaceLandmarks()` and `drawFaceExpressions()` method is called to draw the detections for face landmarks and expressions on the resized `canvas`.
12. `requestAnimationFrame()` is called with `drawFaceDetection()` parameter to call detection when there is an updated detection for the face.
13. The user will now see their webcam playback with a bounding box containing detection results indicating if the face emotions are sad or happy along with facial landmarks.