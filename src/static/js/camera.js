function Camera(modalID) {
    const width = 320;
    let height = 0;

    let streaming = false;

    let video = null;
    let canvas = null;
    let data;

    function startup(modalID) {
        if (video) {
            video.play();
            return;
        }

        video = document.querySelector(`#${modalID} .video`);
        canvas = document.querySelector(`#${modalID} .canvas`);
        canvas.style.display = 'none';
        data = null;

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

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);
    }

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

    function approvePicture(modalID) {
        const image = data;
        startup(modalID);
        return image;
    }

    function rejectPicture(modalID) {
        startup(modalID);
    }

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

    startup(modalID);
    return { takePicture, approvePicture, rejectPicture, isAvailable };
}