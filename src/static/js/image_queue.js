function createImageQueue(updateLabel, disableButton = ()=>{}) {
    const base64Images = [];

    const clear = () => {
        base64Images.length = 0;
        updateLabel(base64Images);
    };
    const getImages = () => base64Images;

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

    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function convertToFile(dataurl, filename) {

        const arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]);

        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {
            type: mime
        });
    }

    function displayOverImageLimitMessage() {
        new standardAlert().warn(`You've reached the upload limit. The maximum amount of images you can have is ${MAX_IMAGES_PER_USER}`);
    }

    function displayInvalidImageMessage() {
        new standardAlert().warn('No face was detected in an uploaded image. Please upload valid images with exactly 1 face in it.');
    }

    async function isValidImage(base64Image) {
        const image = document.createElement('img');
        image.src = base64Image;

        const detections = await faceapi.detectAllFaces(image);

        return hasSingleFace(detections);
    }

    const hasSingleFace = (detections) => detections.length === 1;

    return { addBase64Image, addFiles, getImages, clear };
}
