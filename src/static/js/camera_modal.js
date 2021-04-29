function cameraModal(processImage, modalId, camera) {
    const photoCapture = document.querySelector(`#${modalId} .startbutton`);
    const approveButton = document.querySelector(`#${modalId} .approve`);
    const rejectButton = document.querySelector(`#${modalId} .reject`);
    const closeModalButton = document.querySelector(`#${modalId} [data-close]`);
    const isVisible = "is-visible";

    function createTakePictureEvent(pictureButton) {
        pictureButton.addEventListener("click", function (e) {
            document.getElementById(modalId).classList.add(isVisible);
        });
    }

    closeModalButton.addEventListener("click", function () {
        document.getElementById(modalId).classList.remove(isVisible);
    });

    document.addEventListener("click", e => {
        if (e.target == document.querySelector(`#${modalId}.modal.is-visible`)) {
            document.querySelector(`#${modalId}.modal.${isVisible}`).classList.remove(isVisible);
        }
    });

    document.addEventListener("keyup", e => {
        if (e.key == "Escape" && document.querySelector(`#${modalId}.modal.is-visible`)) {
            document.querySelector(`#${modalId}.modal.${isVisible}`).classList.remove(isVisible);
        }
    });

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

    function toggleButtonsForStream() {
        document.querySelectorAll(`#${modalId} .photo-toggle`).forEach(element => element.style.display = 'none');
        document.querySelector(`#${modalId} .startbutton`).style.display = 'inline';
    }

    function toggleButtonsForPicture() {
        document.querySelectorAll(`#${modalId} .photo-toggle`).forEach(element => element.style.display = 'none');
        document.querySelector(`#${modalId} .approve`).style.display = 'inline';
        document.querySelector(`#${modalId} .reject`).style.display = 'inline';
    }

    toggleButtonsForStream();

    return { createTakePictureEvent };
}