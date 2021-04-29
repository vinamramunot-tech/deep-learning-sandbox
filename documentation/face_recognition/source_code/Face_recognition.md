- This code is from .src/static/js/face_recognition_for_user_video

- Data is retrieved from the Database and loaded into a new faceapi model with new faceDescriptions

```js

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

```

- The following code shows how face descriptions are retrieved from the images that a user uploaded

- if there is not a descriptor on detections then a face was unable to be detected on the uploaded photo. On the prior code example these undefinded descriptors are filtered out of the model.

```js
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
```
