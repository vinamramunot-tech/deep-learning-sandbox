(function () {
    let uploadedFile;
    const imageUploadId = 'imageUpload';
    const detectButtonId = 'detect-button';
    const formId = 'faceapi-form';
    const inputImageId = 'input-image';
    const outputContainerId = 'output';
    const dropZoneId = 'drop-zone';
    const dropBoxId = 'drop-box';
    const showUploadFileNameId = 'upload-file-name';
    
    faceApiModel.then(start);

    async function start() {
        pageStartLoading();
        const container = document.getElementById(outputContainerId);
        container.style.position = 'relative';
        const labeledFaceDescriptors = await loadLabeledImages();

        let image = document.createElement('img');
        let canvas = document.createElement('canvas');

        document.getElementById(imageUploadId).style.display = "block";
        document.getElementById(detectButtonId).disabled = false;
        document.getElementById(dropBoxId).style.display = "block";
        document.getElementById(dropZoneId).style.display = "block";
        document.getElementById(formId).addEventListener('submit', async e => {
            e.preventDefault();

            if (image) image.remove();
            if (canvas) canvas.remove();

            if (isValidFileType(uploadedFile)) {
                detectButtonStartLoading();

                const distanceThreshold = document.getElementById("faceapi_threshold").value;
                const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, distanceThreshold);
                image = await faceapi.bufferToImage(uploadedFile);
                image.id = inputImageId;
                canvas = faceapi.createCanvasFromMedia(image);
                
                image.classList.add('responsive-media');
                canvas.classList.add('responsive-media');
                
                container.append(image);
                container.append(canvas);

                const displaySize = { width: image.width, height: image.height };
                faceapi.matchDimensions(canvas, displaySize);

                const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
                    drawBox.draw(canvas);
                });

                disableContextMenu(image);
                disableContextMenu(canvas);

                detectButtonStopLoading();

                showDownloadButton();
            }
        });
        pageStopLoading();
    }

    function disableContextMenu(element) {
        element.addEventListener("contextmenu", event => event.preventDefault());
    }

    function showDownloadButton() {
        const btn = document.getElementById('download-button');
        btn.addEventListener('click', convertMediaForDownload);
        btn.style.display = "block";
   }

    function isValidFileType(inputFile) {
        let inputFileType = inputFile['type'].split('/')[0];
        if (inputFileType != 'image' || inputFileType.replace(/[^.]/g, '').length > 1) {
            alert("File type must be .jpg, .JPG, .jpeg, .JPEG, .png, .PNG, .gif, .GIF");
            return false;
        }
        return true;
    }

    function downloadOutput(anchorTag) {
        const uploadImgName = uploadedFile.name;
        const uploadImgExtension = uploadImgName.substring(uploadImgName.lastIndexOf('.') + 1);
        anchorTag.download = uploadImgName.replace(`.${uploadImgExtension}`, `-output.${uploadImgExtension}`);
        anchorTag.click();
    }

    function convertMediaForDownload() {
        const container = document.getElementById(outputContainerId);
        const inputImage = document.getElementById(inputImageId);
        const anchorTag = document.createElement('a');
        const img = document.createElement('image');
        html2canvas(container, { width: inputImage.width }).then(canvas2 => {
            img.src = canvas2.toDataURL("image/png");
            anchorTag.href = img.src;
            anchorTag.appendChild(img);
            downloadOutput(anchorTag);
        });
    }

    function detectButtonStartLoading() {
        document.getElementById(detectButtonId).disabled = true;
        document.getElementById(detectButtonId).className = 'loading-spinner';
    }

    function detectButtonStopLoading() {
        document.getElementById(detectButtonId).classList.remove('loading-spinner');
        document.getElementById(detectButtonId).disabled = false;
    }

    function pageStartLoading() {
        document.getElementById('page-loading-spinner').className = 'page-loading-spinner';
    }

    function pageStopLoading() {
        document.getElementById('page-loading-spinner').classList.remove('page-loading-spinner');
    }

    function loadLabeledImages() {
        const LabeledFaceDescriptors = faceapi.LabeledFaceDescriptors;
        const labels = ['jacob', 'jimmy', 'rodney', 'vinamra', 'dr. chen'];
        const labeledFaceDescriptors = labels.map(async label => 
            new LabeledFaceDescriptors(
                label, 
                await getFaceDescriptions(label)
            )
        );
        
        return Promise.all(labeledFaceDescriptors);
    }

    async function getFaceDescriptions(label) {
        const NUMBER_OF_TRAINING_IMAGES = 10;
        const descriptions = [];
        for (let i = 1; i <= NUMBER_OF_TRAINING_IMAGES; i++) {
            const img = await faceapi.fetchImage(`static/labeled_images/${label}/${i}.png`);
            const detections = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();
            detections.descriptor.length && descriptions.push(detections.descriptor);
        }
        return descriptions;
    }

    document.getElementById(dropZoneId).addEventListener('dragover', function (e) {
        e.preventDefault();
        document.getElementById(dropBoxId).classList.add("drop-box-faceapi");
    });

    document.getElementById(dropZoneId).addEventListener('dragleave', function (e) {
        e.preventDefault();
        document.getElementById(dropBoxId).classList.remove("drop-box-faceapi");
    });

    document.getElementById(dropZoneId).addEventListener('drop', function (e) {
        e.preventDefault();
        document.getElementById(dropBoxId).classList.remove("drop-box-faceapi");
        uploadedFile = e.dataTransfer.files[0];
        document.getElementById(showUploadFileNameId).innerHTML = `File uploaded: ${e.dataTransfer.files[0].name}`;
    });

    document.getElementById(imageUploadId).addEventListener('input', function(e){
        uploadedFile = e.target.files[0];
        document.getElementById(showUploadFileNameId).innerHTML = `File uploaded: ${e.target.files[0].name}`;
    });
})();