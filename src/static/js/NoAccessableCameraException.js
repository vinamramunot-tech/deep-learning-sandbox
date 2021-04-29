function NoAccessableCameraException() {
    this.message = 'Camera not detected. Either the device does not have a camera ' +
    'or we do not have permission to use the camera on your device. To give ' + 
    'permission to use the camera, refresh the page and click allow when the ' +
    'page requests to use your camera.';
}

NoAccessableCameraException.prototype = Object.create(Error.prototype);
NoAccessableCameraException.prototype.name = 'NoAccessableCameraException';
NoAccessableCameraException.prototype.constructor = NoAccessableCameraException;
