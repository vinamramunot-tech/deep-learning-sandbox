# Video Object Detection YOLO

1. User chooses a file using the `Choose File` button.
2. User inputs a number for the threshold that's between 0.0 and 1.0. A threshold value is the tunable parameter used to assess the probability of the object class appearing in the bounding box. Accordingly, a threshold is set to turn these confidence probabilities into classifications, where detections are considered true positives (TP), while the ones below the threshold are considered false positives (FP).
3. User clicks on `detect` button and then `mediaPopulator` inside of `src/static/js/media_populator.js` file is called.
    - `populateMedia` is passed in with the parameters of the event and the `video_detection_mode`
    - async function `uploadMedia` is called which is passed in parameters of `form`, `media file`(uploaded file), `detectionMode` (in this case it is 1)
        1. Inside of the method `uploadMedia`, `FormData` type is created which contains the `uploaded file` and the `detection mode`
        2. `uploadMedia` returns with the POST request and passes the `FormData` as the body of the request
    - `handleResponse` is called to check if the return of the previous `formData` was successful or not
    - if the request was not successful then exit the `populateMedia` method, however, if the request was successful then move to the next method call
    - `uploadResponse` is converted to json format and assigned to a variable `mediaCreator`
    - `getMediaCreatorInstance` is called with parameters of the type of `mediaCreator` which in this case is an image
        1. `video` type HTML element is created and returned with the `video.src` of the output file to the new created variable `mediaCreator`
    - if there was any media already appended to the `media-container` it is removed
    - The `mediaCreator` is appended to the media-container
4. Inside of `src/controllers/object_detection_controller.py`, an API is called to '/object-detection/detect' and `upload_image_file` function runs. `uploaded_file = request.files['file']` function inside of `src/controller/object_detection_controller.py` receives the file as a request as `formData` from `uploadMedia` inside `src/static/js/media_populator.js` file.
5. An object of type `MediaDetectionFactory().create_instance(int(detection_mode))` is created by the name of `media`
    - As the `detection_mode` is passed in determines what type of object is created, either `ImageMedia` or `VideoMedia`
    - In this case as the `detection_mode` is `1`, `VideoMedia` type will be returned
6. Inside `src/controllers/object_detection_controller.py` the uploaded file extensions are checked against valid video extensions (mp4) using `get_file_extension` from `src/servies/media.py`.
7. Uploaded file is saved in the `uploads/videos` path.
8. From step 5, the `media` object is used to call the `create` method that has the filename and the threshold parameter passed into it.
    - `src/services/media.py` sends the information of the _video_ (as bytes) and the _threshold_ to the `src/yolo/video_detection/yolo_video_object_detection.py` file for further processing inside of `detect_image` function.
9. The threshold value is set for the YOLO model inside of `src/yolo/yolo_threshold.py` using the `set_threshold_or_default` function.
    -  If the user doesn't provide any input inside the input field with id yolo_threshold in `src/templates/image_object_detection.html` then the `set_threshold_or_default` function uses the default value, `YOLO_THRESHOLD`, from the environment variable file (in src/.env) as the threshold. The `.env` file is created manually by the person running the application locally or the person managing the server. It also has same structure as the env_example.txt file under the src folder.

10. Opencv is used to read the **&quot;video&quot;**.
11. Video output object flags are set using &quot;\_\_set\_video\_output\_config&quot; and that information is returned and assigned to variables which contains `width`, `height`, `fps`, `codec`.
12. The video path of the uploaded filename is split into the path of the file (`path`) and the extension of the file (`extension`) using `os.path.splitext(video_path)`.
13. A new output name is created using the `path`, `extension` from the previous step with `-output` in the middle.
14. The info returned in the previous step is used to create a &quot; **out**&quot; named video object with the following information (output filename, codec, fps, (width, height)).
15. A while loop is used to read &quot;video&quot; (step 8).
    - Every frame is read of the frame and checked until there is no frame left to read.
    - For each frame which is taken as an `image`, configurations are set such as image color (dimensions (1, 2, 3)), the tensor dimension of the image, dimension of the image using `cv2.cvtColor(image, cv2.COLOR_BGR2RGB)`, `tf.expand_dims(image_in, 0)` , `transform_images(image_in, FLAGS.size)` respectively.
    - Output from the previous step is sent with a call for yolo model using `get_yolo_model()(image_in)`
        1. `k.set_general_flags()` sets the sets the following flags inside yolo_config.py for the yolo model
            - path to `classes` for detection, path to the `weights` for the model, and the number of detection classes is set to `80` is set
        2. `YoloV3` creates the object for the yolo model from `src/yolo/yolo_model.py` returns the information on that video frame (boxes, scores, classes and nums of classes).
    - The information returned from the previous step is incorporated inside of the uploaded frame (draw\_output) and then new &quot; **image**&quot;is returned.
    - The returned **&quot;image&quot;** from the above step is appended to the output video object &quot;**out**&quot; (step 10).
16. Once the while loop breaks, video file opener is closed (&quot;video.release()&quot;).
17. The output\_file is returned to the `src/services/media.py`.
18. The output_file is then converted to the correct codec which is `libx264`, using `ffmpeg`
19. media.py receives the video and returns the base64 of the video to the `src/controllers/object_detection_controller.py`.
20. Controller deletes the original video from the uploaded folder and returns the new video to the view (`src/templates/video_object_detection.html`) as json dump.
21. **New video is displayed.**