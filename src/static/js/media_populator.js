const mediaPopulator = (function () {
    const OBJECT_DETECTION_ENDPOINT = '/object-detection/detect';
    let uploadedFile;
    const dropZoneId = 'drop-zone';
    const mediaUploadButtonId = 'media-upload-button';
    const downloadButtonId = 'download-button';
    const showUploadFileNameId = 'upload-file-name';

    document.getElementById(downloadButtonId).addEventListener('click', downloadMedia);

    async function populateMedia(event, detectionMode) {
        event.preventDefault();

        startLoading();
        const uploadResponse = await uploadMedia(event.target, uploadedFile, detectionMode);
        if (!await handleResponse(uploadResponse)) return;
        const mediaResponse = await uploadResponse.json();

        const mediaCreator = getMediaCreatorInstance(mediaResponse.type);
        clearMediaFrom('media-container');
        appendMedia('media-container', mediaResponse.media, mediaCreator);
        stopLoading();
    }

    function startLoading() {
        document.getElementById('detect-button').className = 'loading-spinner';
    }

    function uploadMedia(form, mediaFile, detectionMode) {
        const formData = new FormData(form);
        formData.append('file', mediaFile);
        formData.append('detection_mode', detectionMode);

        return fetch(OBJECT_DETECTION_ENDPOINT, {
            method: 'POST',
            body: formData,
        });
    }

    async function handleResponse(response) {
        const BAD_REQUEST = 400;

        if (response.status >= BAD_REQUEST) {
            const { error } = await response.json();
            alert(error);
            stopLoading();
            return false;
        }

        return true;
    }

    function getMediaCreatorInstance(mediaType) {
        const MediaTypes = {
            IMAGE: 'image',
            VIDEO: 'video',
        };

        if (mediaType === MediaTypes.IMAGE) {
            const createImageWithBase64Prefix = base64ImageData => 'data:image/png;base64,' + base64ImageData;
            const ImageMedia = {
                create: base64ImageData => {
                    const imgTag = document.createElement('img');
                    imgTag.src = createImageWithBase64Prefix(base64ImageData);
                    imgTag.className = 'image-cursor';
                    return imgTag;
                },
            };
            return ImageMedia;
        }

        if (mediaType === MediaTypes.VIDEO) {
            const createVideoWithBase64Prefix = base64VideoData => 'data:video/mp4;base64,' + base64VideoData;
            const VideoMedia = {
                create: base64VideoData => {
                    const videoTag = document.createElement('video');
                    videoTag.src = createVideoWithBase64Prefix(base64VideoData);
                    videoTag.type = 'video/mp4';
                    videoTag.controls = true;
                    videoTag.className = 'video-cursor';
                    return videoTag;
                },
            }
            return VideoMedia;
        }
    }

    function createMediaAnchor(media) {
        const a = document.createElement('a');
        a.href = media.src;
        a.id = 'media-download-anchor-tag';
        return a;
    }

    function clearMediaFrom(mediaContainerId) {
        const mediaContainer = document.getElementById(mediaContainerId);

        while (mediaContainer.hasChildNodes()) {
            const child = mediaContainer.firstChild;
            mediaContainer.removeChild(child);
        }
    }

    function showDownloadButton() {
        document
            .getElementById(downloadButtonId)
            .style.display = 'block';
    }

    function appendMedia(mediaContainerId, base64Data, mediaCreator) {
        const mediaTag = mediaCreator.create(base64Data);
        mediaTag.classList.add('media');
        mediaTag.classList.add('responsive-media-variable-height');
        const a = createMediaAnchor(mediaTag);
        document.getElementById(mediaContainerId).appendChild(a);
        document.getElementById(mediaContainerId).appendChild(mediaTag);
        showDownloadButton();
    }

    function downloadMedia() {
        const anchorDownload = document.getElementById('media-download-anchor-tag');
        const uploadImgName = uploadedFile.name;
        const uploadImgExtension = uploadImgName.substring(uploadImgName.lastIndexOf('.') + 1);
        anchorDownload.download = uploadImgName.replace(`.${uploadImgExtension}`, `-output.${uploadImgExtension}`);
        anchorDownload.click();
    }

    function stopLoading() {
        document.getElementById('detect-button').classList.remove('loading-spinner');
    }

    document.getElementById(dropZoneId).addEventListener('dragover', function (e) {
        e.preventDefault();
        e.target.className = `${dropZoneId} dragover`;
        return false;
    });

    document.getElementById(dropZoneId).addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.target.className = dropZoneId;
        return false;
    });

    document.getElementById(dropZoneId).addEventListener('drop', function (e) {
        e.preventDefault();
        e.target.className = dropZoneId;
        uploadedFile = e.dataTransfer.files[0];
        document.getElementById(showUploadFileNameId).innerHTML = `File uploaded: ${e.dataTransfer.files[0].name}`;
    });

    document.getElementById(mediaUploadButtonId).addEventListener('input', function (e) {
        uploadedFile = e.target.files[0];
        document.getElementById(showUploadFileNameId).innerHTML = `File uploaded: ${e.target.files[0].name}`;
    });

    return populateMedia;
})();
