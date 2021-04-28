from flask import render_template
from src import app

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/image_object_detection.html')
def image_object_detection():
    return render_template('/image_object_detection.html')

@app.route('/video_object_detection.html')
def video_object_detection():
    return render_template('/video_object_detection.html')

@app.route('/face_emotion_landmark_for_video.html')
def face_detection():
    return render_template('face_emotion_landmark_for_video.html')
    
@app.route('/face_recognition_for_image.html')
def face_recognition_image():
    return render_template('face_recognition_for_image.html')

@app.route('/face_recognition_for_user_video.html')
def face_name_recognition_webcam():
    return render_template('face_recognition_for_user_video.html')

@app.route('/user_upload.html')
def image_upload():
    return render_template('user_upload.html')
    
@app.route('/realtime_object_detection_for_webcam.html')
def realtime_object_detection_webcam():
    return render_template('realtime_object_detection_for_webcam.html')

@app.route('/face_mask_detection.html')
def face_mask_detection():
    return render_template('face_mask_detection.html')

@app.route('/digitinator.html')
def digitinator():
    return render_template('digitinator.html')

@app.route('/voice_cloning.html')
def voice_cloning():
    return render_template('voice_cloning.html')
