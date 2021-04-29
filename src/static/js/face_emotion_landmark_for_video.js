(function () {
    const video = document.getElementById("video");

    document
        .getElementById('faceapi-face-detection-form')
        .addEventListener('submit', e => {
            e.preventDefault();

            navigator
                .mediaDevices
                .getUserMedia({ video: {} })
                .then(
                    stream => video.srcObject = stream,
                    error => {
                        if (error instanceof DOMException && error.name === 'NotFoundError')
                            throw new NoAccessableCameraException();
                        throw error;
                    }
                )
                .catch(error => {
                    console.error(error);
                    if (error instanceof NoAccessableCameraException)
                        alert(error.message);
                });
        });


    let canvas;
    video.addEventListener('playing', () => {
        if (canvas)
            canvas.remove();

        const threshold = Number(document.getElementById("faceapi_threshold").value);

        canvas = faceapi.createCanvasFromMedia(video);

        const outputContainer = document.getElementById('output');
        outputContainer.appendChild(canvas);

        (async function drawFaceDetection() {
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: threshold }))
                .withFaceLandmarks()
                .withFaceExpressions();

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            const videoDimensions = {
                width: video.offsetWidth,
                height: video.offsetHeight,
            };
            faceapi.matchDimensions(canvas, videoDimensions);
            const resizedDetections = faceapi.resizeResults(detections, videoDimensions);
            
            const { drawDetections, drawFaceLandmarks, drawFaceExpressions, } = faceapi.draw;
            drawDetections(canvas, resizedDetections);
            drawFaceLandmarks(canvas, resizedDetections);
            drawFaceExpressions(canvas, resizedDetections);

            requestAnimationFrame(drawFaceDetection);
        })();
    });
})();