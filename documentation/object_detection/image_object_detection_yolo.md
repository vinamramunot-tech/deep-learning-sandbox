# Image Object Detection YOLO

1. User chooses a file using the `Choose File` button.
2. User inputs a number for the threshold that's between 0.0 and 1.0. A threshold value is the tunable parameter used to assess the probability of the object class appearing in the bounding box. Accordingly, a threshold is set to turn these confidence probabilities into classifications, where detections are considered true positives (TP), while the ones below the threshold are considered false positives (FP).
3. User clicks on `detect` button and then `mediaPopulator` inside of `src/static/js/media_populator.js` file is called and passed with parameters `e`(event) and the variable `IMAGE_DETECTION_MODE`
    - `populateMedia` is passed in with the parameters of the event and the `image_detection_mode`
    - async function `uploadMedia` is called which is passed in parameters of `form`, `media file`(uploaded file), `detectionMode` (in this case it is 0)
        1. Inside of the method `uploadMedia`, `FormData` type is created which contains the `uploaded file` and the `detection mode`
        2. `uploadMedia` returns with the POST request and passes the `FormData` as the body of the request
    - `handleResponse` is called to check if the return of the previous `formData` was successful or not
    - if the request was not successful then exit the `populateMedia` method, however, if the request was successful then move to the next method call
    - `uploadResponse` is converted to json format and assigned to a variable `mediaCreator`
    - `getMediaCreatorInstance` is called with parameters of the type of `mediaCreator` which in this case is an image
        1. `img` type HTML element is created and returned with the `image.src` of the output file to the new created variable `mediaCreator`
    - if there was any media already appended to the `media-container` it is removed
    - The `mediaCreator` is appended to the media-container
4. Inside of `src/controllers/object_detection_controller.py`, an API is called to '/object-detection/detect' and `upload_image_file` function runs. `uploaded_file = request.files['file']` function inside of `src/controllers/object_detection_controller.py` receives the file as a request as `formData` from `uploadMedia` inside `src/static/js/media_populator.js` file.
5. An object of type `MediaDetectionFactory().create_instance(int(detection_mode))` is created by the name of `media`
    - As the `detection_mode` is passed in determines what type of object is created, either `ImageMedia` or `VideoMedia`
    - In this case as the `detection_mode` is `0`, `ImageMedia` type will be returned
6. Inside `src/controllers/object_detection_controller.py` the uploaded file extensions are checked against valid image extensions (png, jpg, gif, and jpeg) using `get_file_extension` from `src/services/media.py`.
7. Uploaded file is saved in the `uploads/images` path
8. From step 5, the `media` object is used to call the `create` method that has the filename and the threshold parameter passed into it
9. Inside of the `media.create` method:
    - media.py sends the image (as bytes) and the threshold to the `src/yolo/image_detection/yolo_image_object_detection.py` file for further processing inside of the `detect_image` function.
    - The threshold value is set for the YOLO model inside of `src/yolo/yolo_threshold.py` using the `set_threshold_or_default` function. 
        1. If the user doesn't provide any input inside the input field with id yolo_threshold in `src/templates/image_object_detection.html` then the `set_threshold_or_default` function uses the default value, `YOLO_THRESHOLD`, from the environment variable file (in src/.env) as the threshold. The `.env` file is created manually by the person running the application locally or the person managing the server. It also has same structure as the env_example.txt file under the src folder. 
    - A call to the YOLO model is made for the uploaded image using `get_yolo_model` function inside `src/yolo/yolo_model.py`.
    - Output from the previous step is sent with a call for yolo model using `get_yolo_model()(img)`
        1. `k.set_general_flags()` sets the sets the following flags inside `src/yolo/yolo_config.py` for the yolo model
            - path to `classes` for detection, path to the `weights` for the model, and the number of detection classes is set to `80` is set
        2. `YoloV3` creates the object for the yolo model from `src/yolo/yolo_model.py` returns the information on that video frame (boxes, scores, classes and nums of classes).
    - The information returned from the previous step is incorporated inside of the uploaded frame (draw\_output) and then new &quot; **image**&quot;is returned.
    - `src/services/media.py` receives the image and returns it to the `src/controllers/object_detection_controller.py`.
10. `src/controllers/object_detection_controller.py` deletes the original image from the uploaded folder and returns the object detected image to the view, `src/templates/image_object_detection.html`, as a JSON object that contains the base64 image with object detection labels.
11. **New image is displayed.**