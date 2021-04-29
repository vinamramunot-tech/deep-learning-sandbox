var faceApiModel = (function preloadFaceApi() {
    if (typeof importScripts === 'function') {
        importScripts('/static/js/face-api.min.js');   
    }
    const faceapiModels = `static/face-api-models`;
    const {
        tinyFaceDetector,
        faceLandmark68Net,
        faceRecognitionNet,
        faceExpressionNet,
        ssdMobilenetv1,
    } = faceapi.nets;
    
    return Promise.all([
        tinyFaceDetector.loadFromUri(faceapiModels),
        faceLandmark68Net.loadFromUri(faceapiModels),
        faceRecognitionNet.loadFromUri(faceapiModels),
        faceExpressionNet.loadFromUri(faceapiModels),
        ssdMobilenetv1.loadFromUri(faceapiModels),
    ]);
})();
