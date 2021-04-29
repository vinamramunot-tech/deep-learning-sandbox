(function preloadDependenciesInBackground() {
    new Worker('static/js/preload_real_time_tensorflow_model.js');
    new SharedWorker('static/js/preload_faceapi.js');
})();