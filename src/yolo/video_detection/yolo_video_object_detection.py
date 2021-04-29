import sys
from absl import app, flags, logging
from absl.flags import FLAGS
from src import app
import cv2
import os
from os import environ, path
import tensorflow as tf
from yolov3_tf2.models import (
    YoloV3, YoloV3Tiny
)
from yolov3_tf2.dataset import transform_images
from yolov3_tf2.utils import draw_outputs
from ..yolo_config import YoloConfig
from ..yolo_model import get_yolo_model, get_class_names
from ..yolo_threshold import set_threshold_or_default
import numpy as np
import time

def __set_video_output_config(video_capture_object):
    width = int(video_capture_object.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video_capture_object.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(video_capture_object.get(cv2.CAP_PROP_FPS))
    codec = cv2.VideoWriter_fourcc(*'mp4v')
    return width, height, fps, codec

def detect_video(video_path, threshold):
    FLAGS.yolo_score_threshold = set_threshold_or_default(threshold)

    frame_count = 0
    
    try:
        video = cv2.VideoCapture(int(video_path))
    except:
        video = cv2.VideoCapture(video_path)

    width, height, fps, codec = __set_video_output_config(video)

    path, extension = os.path.splitext(video_path)
    output_file = path + '-output' + extension

    out = cv2.VideoWriter(output_file, codec, fps, (width,height))

    while video.isOpened():
        has_frame, image = video.read()
        if has_frame:
            image_in = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image_in = tf.expand_dims(image_in, 0)
            image_in = transform_images(image_in, FLAGS.size)

            boxes, scores, classes, nums = get_yolo_model()(image_in)

            image = draw_outputs(image, (boxes, scores, classes, nums), get_class_names())
            image = cv2.putText(
                image, 
                "", 
                (0, 30), 
                cv2.FONT_HERSHEY_COMPLEX_SMALL, 
                1, 
                (0, 0, 255),
                2
            )

            out.write(image)

            frame_count += 1
            print('[In progress...] Writing frame:', frame_count)
        else:
            break

    video.release()

    return output_file
    