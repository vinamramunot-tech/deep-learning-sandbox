# Related Files

1. src/static/css/index.css
2. src/static/templates/face_recognition_for_video.html
3. src/static/js/face_recognition_for_video.js
4. src/static/face-api-models/ssd_mobilenetv1_model-weights_manifest.json
5. src/static/face-api-models/ssd_mobilenetv1_model-shard1
6. src/static/face-api-models/ssd_mobilenetv1_model-shard2
7. src/static/js/face-api.min.js
8. src/static/face-api-models/face_landmark_68_model-weights_manifest.json
10. src/static/face-api-models/face_expression_model-weights_manifest.json
11. src/static/face-api-models/face_recognition_model-weights_manifest.json
12. src/static/face-api-models/ssd_mobilenetv1_model-weights_manifest.json
13. src/static/face-api-models/tiny_face_detector_model-weights_manifest.json
14. src/static/face-api-models/face_landmark_68_model-shard1
15. src/static/face-api-models/face_expression_model-shard1
16. src/static/face-api-models/face_recognition_model-shard1
17. src/static/face-api-models/face_recognition_model-shard2
18. src/static/face-api-models/ssd_mobilenetv1_model-shard1
19. src/static/face-api-models/ssd_mobilenetv1_model-shard2
20. src/static/face-api-models/tiny_face_detector_model-shard1

# Face Recognition for webcam (faceapi)

1. User navigates to face-recognition for webcam page
2. All of the required models (tinyFaceDetector, faceLandmark68Net, faceRecognitionNet, faceExpressionNet, ssdMobilenetv1) are loaded
3. User clicks on "Detect" button with a custom or default threshold setting
4. The submit event listener is fired and a video stream via webcam plays on the page
5. The video element plays the event listener to create a canvas using `faceapi.createCanvasFromMedia(videoObject)`
6. An `outputContainer` variable is made
7. The `labeledFaceDescriptors` is assigned by the `loadLabeledImages()`
    - We get images from the database
    - For each image `faceapi.LabeledFaceDescriptors` is called and returned with face descriptors with labels
8. We get `distanceThreshold` from the input field 
9. The `labeledFaceDescriptors` and `distanceThreshold` is passed into `faceapi.FaceMatcher` and this gets assigned to the variable `faceMatcher`
10. We set the heigh and width of the `outputContainer`
11. The canvas overlays on a output div container using `outputContainer.appendChild(canvas)`
12. `faceapi.matchDimensions` is used to resize the media elements
13. A call to `drawFaceDetection()` is made asynchronously to continously perform the face recognition with labeled training data loaded earlier in (7). This function retrieves detection data by calling `faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()` to show facial landmarks + labels + score. The results are passed to `faceapi.resizeResults(detections, displaySize)` to be resized according to the display size. The results are determined by mapping the resized detection results with `faceMatcher.findBestMatch(descriptor)`. The bounding box is drawn using `faceapi.draw.DrawBox(box)` with "box" being the resized detection results. The arrangment of the text is determined using `faceapi.draw.DrawTextField([results[j]], result.detection.box.bottomLeft).draw(canvas)`. `requestAnimationFrame()` is called to update an animation before the next repaint, in this case it is for our video animation update.
14. The user will now see their webcam playback with a bounding box containing detection results if found