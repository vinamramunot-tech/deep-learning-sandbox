import os
import subprocess
import sys
import wget

YOLO_DIR = './src/yolo'
YOLO_WEIGHTS_DIR = './src/yolo_weights'
GITHUB_RAW = 'https://raw.githubusercontent.com'
CONVERT = f'{YOLO_WEIGHTS_DIR}/checkpoints'
GITHUB_LOCAL ='https://github.com/vinamramunot-tech'
FACE_MODEL_GITHUB = f'{GITHUB_LOCAL}/Face-Recognition-JavaScript/raw/master/models'
FACE_API_MODEL_FOLDER = './src/static/face-api-models/'
YOLOV3_TF2_REPO = f'git+{GITHUB_LOCAL}/yolov3-tf2.git@master'

def install_yolov3tf2_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def transferring_weights(filename_convert_script, filename_darknet_weights, filename_converted_weights):
    subprocess.check_call([sys.executable, filename_convert_script, "--weights", filename_darknet_weights, "--output", filename_converted_weights])

def download_to_file(download_url, filename, directory):
    if not os.path.exists(f'{directory}/{filename}'):
        wget.download(download_url, directory)

def create_folder(folder_name):
    if not os.path.isdir(folder_name):
        os.makedirs(folder_name)

install_yolov3tf2_package(YOLOV3_TF2_REPO)
create_folder(f'{YOLO_WEIGHTS_DIR}')
download_to_file('https://pjreddie.com/media/files/yolov3.weights', '/yolov3.weights', f'{YOLO_WEIGHTS_DIR}')    
download_to_file(f'{GITHUB_RAW}/pjreddie/darknet/master/cfg/yolov3.cfg', '/yolov3.cfg', f'{YOLO_WEIGHTS_DIR}')
download_to_file(f'{GITHUB_RAW}/pjreddie/darknet/master/data/coco.names', '/coco.names', f'{YOLO_WEIGHTS_DIR}')
download_to_file(f'{GITHUB_RAW}/zzh8829/yolov3-tf2/master/convert.py', '/convert.py', f'{YOLO_WEIGHTS_DIR}')
transferring_weights(f'{YOLO_WEIGHTS_DIR}/convert.py', f'{YOLO_WEIGHTS_DIR}/yolov3.weights', f'{CONVERT}/yolov3.tf')

create_folder(f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/face_landmark_68_model-shard1', 'face_landmark_68_model-shard1', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/face_landmark_68_model-weights_manifest.json', 'face_landmark_68_model-weights_manifest.json', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/face_recognition_model-shard1', 'face_recognition_model-shard1', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/face_recognition_model-shard2', 'face_recognition_model-shard2', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/face_recognition_model-weights_manifest.json', 'face_recognition_model-weights_manifest.json', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/mtcnn_model-shard1', 'mtcnn_model-shard1', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/mtcnn_model-weights_manifest.json', 'mtcnn_model-weights_manifest.json', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/ssd_mobilenetv1_model-shard1', 'ssd_mobilenetv1_model-shard1', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/ssd_mobilenetv1_model-shard2', 'ssd_mobilenetv1_model-shard2', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/ssd_mobilenetv1_model-weights_manifest.json', 'ssd_mobilenetv1_model-weights_manifest.json', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/tiny_face_detector_model-shard1', 'tiny_face_detector_model-shard1', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{FACE_MODEL_GITHUB}/tiny_face_detector_model-weights_manifest.json', 'tiny_face_detector_model-weights_manifest.json', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{GITHUB_LOCAL}/Face-Detection-JavaScript/raw/master/models/face_expression_model-shard1', 'face_expression_model-shard1', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{GITHUB_RAW}/vinamramunot-tech/Face-Detection-JavaScript/master/models/face_expression_model-weights_manifest.json', 'face_expression_model-weights_manifest.json', f'{FACE_API_MODEL_FOLDER}')
download_to_file(f'{GITHUB_RAW}/vinamramunot-tech/Face-Recognition-JavaScript/master/face-api.min.js', 'face-api.min.js', './src/static/js/')
