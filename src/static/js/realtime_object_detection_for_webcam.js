var model = undefined;
var children = [];

(() => {
    const video = document.getElementById("webcam");
    const DETECT_BUTTON_ID = "detect-button";
    const liveView = document.getElementById("live-view");
    const enableWebcamButton = document.getElementById(DETECT_BUTTON_ID);
    let animationFrameId;

    (function loadModel() {
        startLoading();
        cocoSsd.load().then(loadedModel => {
            stopLoading();
            model = loadedModel;
        });
    })();

    (function runAppIfMediaIsSupported() {
        if (isUserMediaSupported()) {
            enableWebcamButton.addEventListener("click", () => {
                disableDetectButtonAfterClick();
                startButtonLoading();
                window.cancelAnimationFrame(animationFrameId);
                enableCam();
                stopButtonLoading();
            });
        } else {
            console.warn("getUserMedia is not supported");
        }

        function isUserMediaSupported() {
            return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        }

        function disableDetectButtonAfterClick() {
            document.getElementById("detect-button").disabled = true;
            setTimeout(() => {
                document.getElementById("detect-button").disabled = false;
            }, 2000);
        }
    })();

    const enableCam = (function () {
        const userDefinedFpsInput = document.getElementById("fps");
        const userDefinedThresholdInput = document.getElementById("accuracy-threshold");

        let userDefinedFps = userDefinedFpsInput.value;
        let userDefinedThreshold = userDefinedThresholdInput.value;
        userDefinedFpsInput.addEventListener("change", e => { userDefinedFps = e.target.value; });
        userDefinedThresholdInput.addEventListener("change", e => { userDefinedThreshold = e.target.value; });

        function enableCam() {
            if (!model) return;

            navigator
                .mediaDevices
                .getUserMedia({ video: true })
                .then(
                    stream => {
                        video.addEventListener("loadeddata", () => startWebcamObjectDetection(userDefinedFps));
                        video.srcObject = stream;
                    },
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
        }

        let fpsInterval, timeThen, timeElapsed;

        function startWebcamObjectDetection(fps) {
            fpsInterval = 1000 / fps;
            timeThen = Date.now();
            predictWebcam();
        }

        function predictWebcam() {
            animationFrameId && window.cancelAnimationFrame(animationFrameId);
            animationFrameId = window.requestAnimationFrame(predictWebcam);

            const timeNow = Date.now();
            timeElapsed = timeNow - timeThen;

            const canvas = document.createElement("canvas");
            canvas.width = video.offsetWidth;
            canvas.height = video.offsetHeight;
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            model?.detect(imageData).then(predictions => {
                if (timeElapsed > fpsInterval) {
                    timeThen = timeNow - (timeElapsed % fpsInterval);

                    for (let i = 0; i < children.length; i++)
                        liveView.removeChild(children[i]);

                    children = [];
                    for (const prediction of predictions.filter(p => p.score > userDefinedThreshold))
                        drawBoundingBox(prediction, children);
                }
            });
        }

        function drawBoundingBox(prediction, children) {
            const p = document.createElement("p");
            p.innerText = `${prediction.class} - with ${Math.round(parseFloat(prediction.score) * 100)}% confidence.`;
            p.style = `margin-left: ${prediction.bbox[0]}px; 
                margin-top: ${prediction.bbox[1] - 10}px; 
                width: ${prediction.bbox[2] - 10}px; 
                top: 0; 
                left: 0;`;

            const highlighter = document.createElement("div");
            highlighter.setAttribute("class", "highlighter");

            highlighter.style = `left: ${prediction.bbox[0]}px; 
                          top: ${prediction.bbox[1]}px;
                          width: ${prediction.bbox[2]}px; 
                          height: ${prediction.bbox[3]}px;`;

            liveView.appendChild(highlighter);
            liveView.appendChild(p);
            children.push(highlighter);
            children.push(p);
        }

        return enableCam;
    })();

    function startLoading() {
        document.getElementById(DETECT_BUTTON_ID).disabled = true;
        document.getElementById("page-loading-spinner").className = "page-loading-spinner";
    }

    function stopLoading() {
        document.getElementById("page-loading-spinner").classList.remove("page-loading-spinner");
        document.getElementById(DETECT_BUTTON_ID).disabled = false;
    }

    function startButtonLoading() {
        document.getElementById(DETECT_BUTTON_ID).className = "loading-spinner";
    }

    function stopButtonLoading() {
        document.getElementById(DETECT_BUTTON_ID).classList.remove("loading-spinner");
    }
})();
