function userComponent(user) {
    const userID = user._id;
    const modalID = 'modal2';

    const chooseFileButton = createChooseFileButton();
    const chooseFileLabel = createChooseFileLabel();
    const uploadButton = createUploadButton();
    const deleteButton = createDeleteButton();
    const userName = createUserNameInput();
    const editButton = createEditButton();
    const takePictureButton = createPictureButton();

    const controls = createControlsContainer();
    const imageContainer = getImageContainer();

    const camera = new Camera(modalID);
    const imageQueue = new createImageQueue(setLabel);
    const { createTakePictureEvent } = new cameraModal(addPictures, modalID, camera);

    createTakePictureEvent(takePictureButton);
    addEditEventToButton(controls);
    addEditEventToButton(imageContainer);
    addNewImages();

    function getComponent() {
        return createUserContainer();
    }

    /*UI logic*/
    function createUserContainer() {
        const container = document.createElement('div');
        container.setAttribute('id', `user-${user._id}`);
        container.className = 'user-images';
        container.appendChild(controls);
        container.appendChild(imageContainer);
        return container;
    }

    function createPictureButton() {
        const pictureButton = document.createElement('button');
        pictureButton.innerHTML = 'Take Picture';
        pictureButton.classList.add('toggle');
        pictureButton.setAttribute('data-open', 'modal1');
        pictureButton.style.display = 'none';
        return pictureButton;
    }

    function createControlsContainer() {
        const controls = document.createElement('div');
        controls.className = 'user-controls';
        controls.appendChild(userName);
        controls.appendChild(editButton);
        controls.appendChild(deleteButton);
        controls.appendChild(uploadButton);
        controls.appendChild(takePictureButton);
        controls.appendChild(chooseFileButton);
        controls.appendChild(chooseFileLabel);
        return controls;
    }

    function createEditButton() {
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        return editButton;
    }

    function createUserNameInput() {
        const userName = document.createElement('input');
        userName.classList.add('name');
        userName.value = user.name;
        userName.disabled = true;
        return userName;
    }

    function createDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('toggle');
        deleteButton.style.display = 'none';
        deleteButton.innerText = 'Delete User';
        return deleteButton;
    }

    function createUploadButton() {
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.multiple = true;
        uploadButton.classList.add('image-upload');
        uploadButton.style.display = 'none';
        uploadButton.innerText = 'Upload Images';
        return uploadButton;
    }

    function createChooseFileLabel() {
        const chooseFileLabel = document.createElement('label');
        chooseFileLabel.classList.add('toggle');
        chooseFileLabel.setAttribute('for', 'choose-files-component');
        chooseFileLabel.innerHTML = '0 Images Selected';
        chooseFileLabel.style.display = 'none';
        return chooseFileLabel;
    }

    function createChooseFileButton() {
        const chooseFileButton = document.createElement('button');
        chooseFileButton.classList.add('toggle');
        chooseFileButton.type = 'button';
        chooseFileButton.id = 'choose-files-component';
        chooseFileButton.innerHTML = 'Choose Images';
        chooseFileButton.style.display = 'none';
        return chooseFileButton;
    }

    function getImageContainer() {
        const createImageWithBase64Prefix = base64ImageData => 'data:image/png;base64,' + base64ImageData;
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        for (const image of user.images) {
            const imageElement = document.createElement('img');
            const deleteImageButton = document.createElement('button');
            deleteImageButton.style.display = 'none';

            deleteImageButton.innerText = 'Delete';
            deleteImageButton.classList.add('delete-image');

            addDeleteEventToImage(deleteImageButton, image.id);

            imageElement.src = createImageWithBase64Prefix(image.src);
            imageContainer.appendChild(imageElement);
            imageContainer.appendChild(deleteImageButton);
        }

        return imageContainer;
    }

    /*Event Driven Logic*/
    deleteButton.addEventListener('click', () => {
        new standardAlert().destructiveAction("Delete User", () => {
            const payload = {
                user_id: userID,
                image_id: ''
            };

            fetch('/users/delete_from_user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    document.getElementById(`user-${userID}`).remove();

                    //TODO: Replace these two lines below when modal is dynamically generated
                    const modal2 = document.getElementById(modalID);
                    modal2.parentNode.replaceChild(modal2.cloneNode(true), modal2);
                });
        });
    });

    function addDeleteEventToImage(button, imageID) {
        const payload = {
            user_id: userID,
            image_id: imageID
        };
        button.addEventListener('click', (event) => {
            new standardAlert().destructiveAction("Delete Image", () => {
                buttonStartLoading(event.srcElement);
                fetch('/users/delete_from_user', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(() => {
                        getSingleUsersImages();
                    });
            });
        });
    }

    function addEditEventToButton(container) {
        editButton.addEventListener('click', () => {
            const name = [...container.getElementsByTagName('input')][0];
            [...container.getElementsByClassName('delete-image')].map(button => button.style.display = (button.style.display === "none") ? "inline" : "none");
            [...container.getElementsByClassName('toggle')].forEach(element => element.style.display = (element.style.display === "none") ? "flex" : "none");

            if (name) {
                if (editButton.innerText === "Lock")
                    sendNameUpdate(name.value);

                name.disabled = !name.disabled;
                editButton.innerText = (editButton.innerText === "Edit") ? "Lock" : "Edit";
            }

            editButton.style.display = 'flex';
        });
    }

    async function uploadImages() {
        const newImages = imageQueue.getImages();

        buttonStartLoading(document.querySelector('#choose-files-component'));

        const formElement = document.createElement('form');
        const elementClone = uploadButton.cloneNode(true);
        formElement.append(elementClone);
        const formData = new FormData(formElement);
        formData.append('user_id', userID);
        for (const image of newImages) {
            formData.append('file', image);
        }

        sendImageUpdate(formData);
        imageQueue.clear();
        buttonStopLoading(document.querySelector('#choose-files-component'));
    }

    /*fetch logic*/
    async function sendImageUpdate(formData) {
        fetch('/users/update_user_profile_images', {
            method: 'PUT',
            body: formData
        })
            .then(async response => {
                if (response.status >= 400)
                    throw await response.json();
            })
            .then(() => {
                getSingleUsersImages();
            })
            .catch(response => {
                alert(response.error);
            });
    }

    function sendNameUpdate(name) {
        buttonStartLoading(editButton);
        fetch('/users/update_user_profile_name', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                user_id: userID
            })
        })
            .then(function (response) {
                buttonStopLoading(editButton);
                if (!response.ok) {
                    throw response;
                }
            })
            .catch(async error => {
                const message = await error.json();
                alert(message.error);
                getSingleUsersName();
            });
    }

    function getSingleUsersImages() {
        fetch('/users/get_one_user_profile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userID
            })
        })
            .then(response => response.json())
            .then(function (newUser) {
                user = newUser;
                const newImageContainer = getImageContainer();

                document.getElementById(`user-${userID}`).replaceChild(newImageContainer, document.querySelector(`#user-${userID} .image-container`));
                document.querySelectorAll(`#user-${userID} .image-container button`).forEach(button => button.style.display = 'inline');

                addEditEventToButton(newImageContainer);
                buttonStopLoading(document.querySelector('#choose-files-component'));
            });
    }

    function getSingleUsersName() {
        fetch('/users/get_one_user_profile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userID
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                document.querySelector(`#user-${userID} .user-controls .name`).value = json['name'];
            });
    }

    /*imageQueue Logic*/
    chooseFileButton.addEventListener('click', (e) => {
        e.preventDefault();
        uploadButton.click();
    });

    function addNewImages() {
        uploadButton.addEventListener('change', async () => {
            if (getMediaFiles().length > 0)
                await imageQueue.addFiles(getMediaFiles());
            await uploadImages();
            uploadButton.value = null;
        });
    }

    async function addPictures(image) {
        await imageQueue.addBase64Image(image);
        uploadImages();
    }

    function getMediaFiles() {
        return uploadButton.files;
    }

    function setLabel(imageList) {
        chooseFileLabel.innerText = `${imageList.length} Images Selected`;
    }

    /*Loading Logic*/
    function buttonStartLoading(buttonId) {
        buttonId.disabled = true;
        buttonId.classList.add('loading-spinner');
    }

    function buttonStopLoading(buttonId) {
        buttonId.classList.remove('loading-spinner');
        buttonId.disabled = false;
    }

    return { getComponent };
}