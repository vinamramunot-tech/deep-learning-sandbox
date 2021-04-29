# Data Flow of User Upload

## camera.js

- camera.js consists of 5 functions: startup, takePicture, approvePicture, rejectPicture, and isAvailable.

- The startup function accesses the webcamera and begins to stream it into a canvas that camera is contained inside of. If a camera is not available then a NoAccessableCameraException is thrown.

```js
function startup(modalID) {
    ...

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
        .then(
            stream => {
                video.srcObject = stream;
                video.play();
            },
            error => {
                if (error instanceof DOMException && error.name === 'NotFoundError')
                    throw new NoAccessableCameraException();
                throw error;
            })
        .catch(error => {
            console.error(error);
            if (error instanceof NoAccessableCameraException)
                new standardAlert().warn(error.message);
        });

    ...
```

- `takePicture` captures the image currently in the video stream on the canvas and pauses the video.

```js
function takePicture() {
        const context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            data = canvas.toDataURL('image/png');
            video.pause();
        }
    }
```

- approvePicture returns the image that was captured by the takePicture function and begins the stream again.

```js
function approvePicture(modalID) {
    const image = data;
    startup(modalID);
    return image;
}
```

- rejectPicture begins the stream again.

```js
function rejectPicture(modalID) {
    startup(modalID);
}
```

- isAvailable determines if a webcamera is available to stream into the canvas from. It returns true if there is a webcamera available or false if there is not.

```js
async function isAvailable() {
    return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
        .then(
            stream => {
                return true;
            },
            error => {
                return false;
            });
}
```

## NoAccessableCameraException.js

- Exception thrown if a webcamera is unable to be accessed.

## camera_modal.js

- camera_modal takes a camera and a callback function to process an image. camera_modal uses the camera to determine what needs displayed on the modal and accesses its takePicture, approvePicture, and rejectPicture functions when its corresponding buttons are clicked. When a picture is approved it is sent to the callback function for image processing. In the callback function an image is processed into the image_queue.

```js
   photoCapture.addEventListener('click', () => {
        camera.takePicture();
        toggleButtonsForPicture();
    });

    approveButton.addEventListener('click', async () => {
        const image = camera.approvePicture(modalId);
        if (image)
            await processImage(image);

        toggleButtonsForStream();
    });

    rejectButton.addEventListener('click', () => {
        camera.rejectPicture(modalId);
        toggleButtonsForStream();
    });
```

## max_image_per_user.js

- Determines the maximum number of images a user can upload.

## image_queue.js

 - image_queue stages images and processes them to be ready for uploading to the database. It stores the images in an array of base64 images. There are 2 ways to process an image into the queue. One is via an array of files, and the other is by passing a single base64 image.

```js
    async function addBase64Image(newImage) {
        disableButton(true);
        if (base64Images.length + 1 > MAX_IMAGES_PER_USER) {
            displayOverImageLimitMessage();
            disableButton(false);
            return;
        }

        if (!await isValidImage(newImage)) {
            displayInvalidImageMessage();
            disableButton(false);
            return;
        }

        const file = convertToFile(newImage, 'MyFile.png');
        base64Images.push(file);

        updateLabel(base64Images);
        disableButton(false);
    }

    async function addFiles(files) {
        disableButton(true);
        if (base64Images.length + files.length > MAX_IMAGES_PER_USER) {
            displayOverImageLimitMessage();
            disableButton(false);
            return;
        }
        let allValidImages = true;

        for (const file of [...files]) {
            const image = await convertToBase64(file);
            const validImage = await isValidImage(image);
            if (validImage) {
                base64Images.push(file);
            }
            else {
                allValidImages = false;
            }
        }

        if (!allValidImages) {
            displayInvalidImageMessage();
        }
        else {
            updateLabel(base64Images);
        }
        disableButton(false);
    }
```
