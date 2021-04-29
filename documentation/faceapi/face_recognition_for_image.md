# Related Files

1. src/static/js/face_recognition_for_image.js
2. src/static/templates/face_recognition_for_image.html
3. src/static/js/face_api.min.js
4. src/static/css/face_api_image.css
5. src/static/css/loading_spinner.css
6. src/static/js/html2canvas.min.js
7. src/static/face-api-models/face_landmark_68_model-weights_manifest.json
8. src/static/face-api-models/face_recognition_model-weights_manifest.json
9. src/static/face-api-models/ssd_mobilenetv1_model-weights_manifest.json
10. src/static/face-api-models/face_landmark_68_model-shard1
11. src/static/face-api-models/face_recognition_model-shard1
12. src/static/face-api-models/face_recognition_model-shard2
13. src/static/face-api-models/ssd_mobilenetv1_model-shard1
14. src/static/face-api-models/ssd_mobilenetv1_model-shard2

# Face Recognition for images

1. when a user lands on `src/templates/face_recognition_for_image.html` loading screen appears and there are some processes are happening behind the scenes:
    - The models for face recognition are loaded using a `Promise.all([..(load model)..])` which loads three models:
        1. `faceLandmark68Net` - This package implements a very lightweight and fast, yet accurate 68 point face landmark detector. The default model has a size of only 350kb (face_landmark_68_model) and the tiny model is only 80kb (face_landmark_68_tiny_model). Both models employ the ideas of depthwise separable convolutions as well as densely connected blocks. The models have been trained on a dataset of ~35k face images labeled with 68 face landmark points.
        2. `faceRecognitionNet` - For face recognition, a ResNet-34 like architecture is implemented to compute a face descriptor (a feature vector with 128 values) from any given face image, which is used to describe the characteristics of a persons face. The model is not limited to the set of faces used for training, meaning you can use it for face recognition of any person, for example yourself. You can determine the similarity of two arbitrary faces by comparing their face descriptors, for example by computing the euclidean distance or using any other classifier of your choice.
        3. `ssdMobilenetv1` - For face detection, a Single Shot Multibox Detector (SSD) based on MobileNetV1. The neural net will compute the locations of each face in an image and will return the bounding boxes together with it's probability for each face. This face detector is aiming towards obtaining high accuracy in detecting face bounding boxes instead of low inference time.
    - After the models are loaded the `start` function is called.
        1. `pageStartLoading()` is started which creates a animation for loading on the screen.
        2. variable `container` get the div element from the html page `src/templates/face_recognition_for_image.html`
        3. `container.style.position` is set `relative` which means it is relative to the position of the previous element
        4. `loadLabeledImages()` is called:
            - `labels` is defined with the name of people who are going to be identified in the image
            - `labels.map(async label => new faceapi.LabeledFaceDescriptors(label, await getFaceDescriptions(label)));` tries to map each label with the correct descriptor that is returned from the `getFaceDescriptions`
                1. The `for` loop is being run for the 10 images that are uploaded by the user under `src/static/labeled_images/{label}/`. 
                2. `faceapi.fetchImage` is called on each of those images for that particular `label` and returns the image to `img`.
                3. `faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();` is called to get the coordinates of the face from the image using face landmarks and face descriptors.
                4. the descriptors of the faces from the 10 images is pushed on to an array `descriptions`
                5. `descriptions` array is returned.
            - `labeledFaceDescriptors` contain the returned `descriptions`
            - `Promise.all(labeledFaceDescriptors)` collects all the `labeledFaceDescriptors` for every label inside of `labels` and returns
        5. `image` and `canvas` element is created using `document.createElement`
        6. The `imageUploadId` input's property for display is set to `block`
        7. Similarly `detect-button` button is enabled by setting the disable property to false.
        8. An `submit` eventListener is added to the form   
        9. `pageStopLoading()` is called to stop the loading on the screen to show that the models and images have loaded
        10. The user can now upload the image to the input `imageUpload` and sets the threshold value.
            - User inputs a number for the threshold that's between 0.0 and 1.0. A threshold value is the tunable parameter used to assess the probability of the object class appearing in the bounding box. Accordingly, a threshold is set to turn these confidence probabilities into classifications, where detections are considered true positives (TP), while the ones below the threshold are considered false positives (FP).
        11. The user clicks on the `Detect` button and the `submit` event is triggered (step 9)
            - The event `e` of the form is set to preventDefault()
            - If there is an image element on the page then it is removed
            - If there is a canvas element on the page then it is removed
            - Then it is checked whether the uploaded file has a valid type or not inside of `isValidFileType()`
                1. `document.getElementById(imageUploadId).files[0]['type'].split('/')[0]` get the type of the file
                2. If the input type is not image or has more than one `.` then an alert is thrown to declare the correct type of input allowed and the function return `false`
                3. If the input type is image then `true` is returned 
            - If `true` is returned from the previous step then `detectButtonStartLoading()` is called to start loading animation on the detect button
            - The `distanceThreshold` is utilized from `document.getElementById("faceapi_threshold").value`
            - To perform face recognition, `faceapi.FaceMatcher` is used to compare reference face descriptors (`labaledFaceDescriptors`) to query face descriptors. We have also used the `distanceThreshold` here as the second parameter to query face descriptors whose distance threshold measure equal or greater than the `distanceThreshold`
            - `image` element which was declared earlier is assigned with the input image element
            - An id is given to the `image` element in the previous step
            - `canvas` element which was declared earlier is assigned with the output of `faceapi.createCanvasFromMedia(image)` which is also canvas type.
            - Both the `image` and `canvas` element is appended to the output container where the canvas is overlaying the image. 
            - The displaySize is set using `image.height` as the `height` and the `image.width` as the `width`
            - `faceapi.matchDimensions(canvas, displaySize)` sets the size of the `canvas` equal to the height and width mentioned inside of the dictionary variable `displaySize`
            - `faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()` gets the `detections` of all the faces from the input image
            - `faceapi.resizeResults(detections, displaySize)` sets the size of the `detections` to the correct size of the display and assigns it to `resizedDetections`
            - `resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))` is used to find the best match from `detections` and the `labeledFaceDescriptors` and is returned to `results`
            - For each `results`:
                1. A `box` element is created from the `resizedetections`
                2. A `drawBox` is created with coordinates from the `box` element with the `label` of the person that matches the best description
                3. This `drawBox` has a draw property that draws the `box` and the `label.toString()` to the canvas for that face
                    - If the face is not identified then the `label.toString()` returns `unknown`
            - The `contextMenu` (html property) is disabled for image and canvas using `disableContextMenu()`
            - The loading animation that was started on the button is removed by calling `detectButtonStopLoading()`
            - `showDownloadButton()` is called:
                1. `download-button` button diplay property is set to `block` on the `src/templates/face_recognition_for_image.html`
                2. An eventListener is added to the `download-button` which calls `convertMediaForDownload()`
        12. If the user clicks on the `download-button` on the `src/templates/face_recognition_for_image.html`:
            - `container` gets the div element with id `output`
            - `inputImage` gets the image element with id `input-image`
            - `anchorTag` element is created using `document.createElement('a')`
            - `img` element is created using `document.createElement('image')`
            - Using the `html2canvas` api which takes the `container` and, the width equal to `inputImage.width`
                1. A new canvas is created which is the output of the api, named `canvas2`
                2. using `toDataURL('image/png')` the base64 of the `canvas2` is returned and assigned to the `img.src`
                3. `anchorTag.href` is set to the `img.src` from the previous step
                4. The `img` is appended as child to the `anchorTag`
                5. The `anchorTag` is passed into `downloadOutput`:
                    - The name of the input image is assigned to `uploadImgName`
                    - "-output." is added after the name of the image and before the extension and is set to the `anchorTag.download`
                    - `anchorTag.click()` is called to download the image


