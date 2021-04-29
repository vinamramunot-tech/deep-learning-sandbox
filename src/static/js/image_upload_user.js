(() => {
    const modalID = 'modal1';
    const fileUpload = document.getElementById('image-uploads');
    const formElement = document.getElementById('new-user');
    const output = document.getElementById('user-info');
    const clearButton = document.getElementById('clear');
    const queueLabel = document.getElementById("message-queue");
    const inputFile = document.getElementById("choose-files");
    const takePictureButton = document.getElementById('take-picture-default');
    const userName = document.getElementById('user-name');
    const uploadButton = document.getElementById('upload');
    const searchName = document.getElementById('search-name');
    const searchForm = document.getElementById('search-form');
    const imageQueue = new createImageQueue(setLabel, disableUpload);
    const camera = new Camera(modalID);
    const { createTakePictureEvent } = new cameraModal(imageQueue.addBase64Image, modalID, camera);

    async function sendUserData(formData, element) {
        uploadButtonStartLoading(element);
        fetch('/users/upload_user_profile', {
            method: 'POST',
            body: formData
        })
            .then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(async userID => {
                new standardAlert().customAction({
                    title: "Redirect", 
                    message: "Would you like to try the Face Recognition page or edit the user you just created?",
                    type: 'info',
                    okButtonName: "Face Recognition", 
                    cancelButtonName: "Edit User",
                    okAction: () => window.location.href = '../face_recognition_for_user_video.html',
                    cancelAction: async () => {
                        imageQueue.clear();
                        searchName.value = userName.value;
                        userName.value = '';
                        document.querySelector('.strip-button-1').click();
                        await getUserById(userID);
                    }
                });
            })
            .catch(async error => {
                const message = (await error?.json?.())?.error;

                if (message)
                    new standardAlert().warn(message);
                else
                    throw error;
            })
            .finally(() => uploadButtonStopLoading(element));
    }

    function disposeUserData() {
        document.getElementById('user-info').textContent = '';
    }

    async function getUserById(userID) {
        await getSingleUserData({ user_id: userID });
    }

    async function getUserByUsername(username) {
        await getSingleUserData({ name: username });
    }

    async function getSingleUserData(payload) {
        await fetch('/users/get_one_user_profile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...payload
            })
        })
            .then(response => {
                if (!response.ok)
                    throw response;
                return response.json();
            })
            .then(user => {
                disposeUserData();
                const userComp = new userComponent(user);
                output.appendChild(userComp.getComponent());
            })
            .catch(async error => {
                const message = (await error?.json?.())?.error;

                if (message)
                    new standardAlert().warn(message);
                else
                    throw error;
            });
    }

    function getMediaFiles() {
        return fileUpload.files;
    }

    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        getUserByUsername(searchName.value);
    });

    formElement.addEventListener('submit', e => {
        e.preventDefault();

        const mediaFile = imageQueue.getImages();
        const formData = new FormData(formElement);
        for (const media of mediaFile) {
            formData.append('file', media);
        }

        sendUserData(formData, e.target.querySelector('#upload'));
    });

    userName.addEventListener('keypress', e => {
        if (e.key === 'Enter' && uploadButton.disabled === false)
            formElement.dispatchEvent(new Event('submit'));
    });

    clearButton.addEventListener('click', e => {
        e.preventDefault();
        new standardAlert().destructiveAction("Clear Images", () => {
            imageQueue.clear();
        });
    });

    inputFile.addEventListener('click', e => {
        e.preventDefault();
        fileUpload.click();
    });

    fileUpload.addEventListener('change', async () => {
        await imageQueue.addFiles(getMediaFiles());
        fileUpload.value = null;
    });

    function disableUpload(shouldBeDisabled) {
        shouldBeDisabled ? disableUploading() : enableUploading();
    }

    function disableUploading() {
        uploadButton.disabled = true;
        inputFile.classList.add('loading-spinner');
    }

    function enableUploading() {
        inputFile.classList.remove('loading-spinner');
        uploadButton.disabled = false;
    }

    function setLabel(imageList) {
        queueLabel.innerText = `${imageList.length} Images Selected`;
    }

    function uploadButtonStartLoading(button) {
        button.disabled = true;
        button.classList.add('loading-spinner');
    }

    function uploadButtonStopLoading(button) {
        button.classList.remove('loading-spinner');
        button.disabled = false;
    }

    function createButtonStrip() {
        const buttonStrip = new ButtonStrip({
            id: 'buttonStrip1'
        });

        buttonStrip.addButton('Account Creation', true, 'click', () => {
            [...document.getElementsByClassName('account-creation')].forEach(element => element.style.display = 'block');
            [...document.getElementsByClassName('user-edit')].forEach(element => element.style.display = 'none');
        });

        buttonStrip.addButton('Edit Existing User', false, 'click', () => {
            [...document.getElementsByClassName('account-creation')].forEach(element => element.style.display = 'none');
            [...document.getElementsByClassName('user-edit')].forEach(element => element.style.display = 'block');
        });

        buttonStrip.append('#headers');
    
        setInitialButtonStripState();
    }
    
    function setInitialButtonStripState() {
        document.querySelector('.active-strip-button').click();
    }
    
    async function setTakePictureButton() {
        takePictureButton.disabled = !(await camera.isAvailable());
    }

    createTakePictureEvent(takePictureButton);
    createButtonStrip();
    setTakePictureButton();
    setLabel([]);
})();
