(function () {
    const record = document.querySelector('.record');
    const stop = document.querySelector('.stop');
    const soundClips = document.querySelector('.sound-clips');
    const mainSection = document.querySelector('.main-controls');
    const submit = document.querySelector('#submit');
    const loading = document.querySelector('.loading');

    deactivateElement(stop);
    deactivateElement(submit);
    let recordedAudio;

    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    })
        .then(function (stream) {
            const mediaRecorder = new MediaRecorder(stream);

            visualize(stream);

            record.addEventListener('click', function () {
                mediaRecorder.start()
                deactivateRecordingState();
            });

            stop.addEventListener('click', function () {
                mediaRecorder.stop()
            });

            mediaRecorder.addEventListener('stop', function () {
                activateRecordingState();
                if (!recordedAudio?.size) return;

                const clipContainer = document.createElement('article');
                const clipLabel = createClipLabel();
                const audio = createAudioClip();
                const deleteButton = createDeleteButtonForAudioClip();

                clipContainer.classList.add('clip');

                removeAllChildNodes(soundClips);
                appendChildToParent(clipContainer, audio);
                appendChildToParent(clipContainer, clipLabel);
                appendChildToParent(clipContainer, deleteButton);
                appendChildToParent(soundClips, clipContainer);

                activateElement(submit);
            });

            mediaRecorder.addEventListener('dataavailable', function (e) {
                if (!e.data.size) {
                    alert("Nothing was recorded.  You may be able to resolve this issue by verifying your microphone is connected to your device correctly and ensure that the microphone you want to use is the operating system's default.");
                    return;
                }
                recordedAudio = e.data;
            });
        })
        .catch(err => alert("An error occurred: " + err));

    function appendChildToParent(parent, child) {
        parent.appendChild(child)
    }

    function activateRecordingState() {
        deactivateElement(stop);
        activateElement(record);
    }

    function deactivateRecordingState() {
        deactivateElement(record);
        activateElement(stop);
    }

    submit.addEventListener('click', function () {
        if (!getInputTextForSynthesizing()) {
            alert("Please type something in the text area");
            return;
        }

        shouldEnableElements(false);
        const form = new FormData();
        form.append('audio', getAudioBlob());
        form.append('text', getInputTextForSynthesizing());
        form.append('filename', getAudioFileName());
        fetch('/voice_cloning', {
            method: 'POST',
            body: form,
        })
            .then(async response => {
                if (!response.ok) {
                    throw await response.json();
                }
                return response.json();
            })
            .then(response => {
                if (!response.output) {
                    alert("Empty Response");
                    return;
                }
                createOutputAudio(response.output);
            })
            .catch(err => {
                alert(`${err.error}\nPlease try again!`)
            })
            .finally(() => {
                shouldEnableElements(true);
            });

    });

    function deactivateElement(element) {
        element.disabled = true;
    }

    function activateElement(element) {
        element.disabled = false;
    }
    function getAudioBlob() {
        return new Blob([recordedAudio], { 'type': 'audio/wav; codecs=MS_PCM' });
    }

    function getAudioFileName() {
        return document.querySelector('#audioId').textContent.trim();
    }

    function createAudioClip() {
        const audio = document.createElement('audio');
        audio.setAttribute('controls', 'controls');
        const blob = getAudioBlob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('loadend', () => {
            const base64data = reader.result;
            audio.src = base64data;
        });
        return audio;
    }
    function createClipLabel() {
        const clipLabel = document.createElement('p');
        clipLabel.id = "audioId";
        const clipName = prompt('Enter a name for your sound clip.');
        clipLabel.textContent = !clipName ? 'My unnamed clip' : clipName;
        clipLabel.addEventListener('click', () => {
            const existingClipName = clipLabel.textContent;
            const newClipName = prompt('Enter a new name for your sound clip.');
            clipLabel.textContent = !newClipName.trim() ? existingClipName : newClipName;
        });
        return clipLabel;
    }

    function createDeleteButtonForAudioClip() {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', e => {
            const eventTarget = e.target;
            eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
            document.getElementById('submit').disabled = true;
        });
        return deleteButton;
    }

    function visualize(stream) {
        const canvas = document.querySelector('.visualizer');
        let audioCtx;
        const canvasCtx = canvas.getContext("2d");
        canvas.width = mainSection.offsetWidth;
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);
        drawVoice();
        function drawVoice() {
            const WIDTH = canvas.width
            const HEIGHT = canvas.height;
            requestAnimationFrame(drawVoice);
            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
            canvasCtx.beginPath();
            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = v * HEIGHT / 2;
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }
    }

    function createOutputAudio(response) {
        const output_audio = document.createElement('audio');
        const sourceTag = document.createElement('source');
        sourceTag.src = `data:audio/wav;base64,${response}`
        output_audio.controls = true;
        output_audio.appendChild(sourceTag);
        const outputdiv = document.querySelector('#output');
        removeAllChildNodes(outputdiv);
        outputdiv.appendChild(output_audio);
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function shouldEnableElements(isEnabled) {
        record.disabled = !isEnabled;
        stop.disabled = !isEnabled;
        document.querySelector('audio').controls = isEnabled;
        document.querySelector('#audioId').disabled = !isEnabled;
        document.querySelector('.delete').disabled = !isEnabled;
        document.querySelector('#submit').disabled = !isEnabled;
        document.querySelector('input#words').disabled = !isEnabled;
        isEnabled ? loading.classList.remove('spinner') : loading.classList.add('spinner');
    }

    function getInputTextForSynthesizing() {
        return document.getElementById('words').value.trim();
    }

    window.addEventListener('resize', () => {
        const canvas = document.querySelector('.visualizer');
        canvas.width = mainSection.offsetWidth;
    });
})();