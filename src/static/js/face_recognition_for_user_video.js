(function () {
    const video = document.getElementById("video");
    const detectButtonId = 'detect-button';

    document
        .getElementById('faceapi-face-recognition-form')
        .addEventListener('submit', e => {
            e.preventDefault();
            detectButtonStartLoading();

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
                    detectButtonStopLoading();
                });
        });

    let canvas;
    video.addEventListener("playing", async () => {
        if (canvas)
            canvas.remove();


        const labeledFaceDescriptors = await loadLabeledImages();
        detectButtonStopLoading();

        if (labeledFaceDescriptors.length == 0) {
            alert("No users have been uploaded. Please upload user information on User Upload page.");
            return;
        }

        const distanceThreshold = document.getElementById("faceapi_threshold").value;
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, distanceThreshold);

        canvas = faceapi.createCanvasFromMedia(video);

        const outputContainer = document.getElementById('output');
        outputContainer.appendChild(canvas);

        (async function drawFaceRecognition() {
            const detections = await faceapi
                .detectAllFaces(video)
                .withFaceLandmarks()
                .withFaceDescriptors();

            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

            const videoDimensions = {
                width: video.offsetWidth,
                height: video.offsetHeight,
            };
            const resizedDetections = faceapi.resizeResults(detections, videoDimensions);
            faceapi.matchDimensions(canvas, videoDimensions);


            if (resizedDetections.length > 0) {
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                results.forEach((_, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box);
                    resizedDetections.forEach((result, j) => {
                        new faceapi.draw.DrawTextField(
                            [results[j]],
                            result.detection.box.bottomLeft
                        ).draw(canvas);
                    });
                    drawBox.draw(canvas);
                });
            }

            requestAnimationFrame(drawFaceRecognition);
        })();
    });

    function detectButtonStartLoading() {
        document.getElementById(detectButtonId).disabled = true;
        document.getElementById(detectButtonId).className = 'loading-spinner';
    }

    function detectButtonStopLoading() {
        document.getElementById(detectButtonId).classList.remove('loading-spinner');
        document.getElementById(detectButtonId).disabled = false;
    }

    async function getDBEntries() {
        return fetch('/users/get_all_user_profiles')
            .then(response => response.json());
    }

    async function loadLabeledImages() {
        const entries = (await getDBEntries()).filter(entry => entry.images.length);
        const labeledFaceDescriptors = entries.map(
            async entry => new faceapi.LabeledFaceDescriptors(
                entry["name"],
                (await getFaceDescriptions(entry["images"])).filter(descriptor => descriptor)
            )
        );

        return (await Promise.all(labeledFaceDescriptors)).filter(({ descriptors }) => descriptors.length);
    }

    async function getFaceDescriptions(images) {
        const descriptions = await images.map(async imageObject => {
            const base64Image = imageObject.src;
            const image = document.createElement("img");
            const createImageWithBase64Prefix = base64ImageData => 'data:image/png;base64,' + base64ImageData;
            image.src = createImageWithBase64Prefix(base64Image);
            const detections = await faceapi
                .detectSingleFace(image)
                .withFaceLandmarks()
                .withFaceDescriptor();

            return detections?.descriptor;
        });

        return Promise.all(descriptions);
    }
})();