import tensorflow as tf
from os import environ, path
from PIL import Image
from absl.flags import FLAGS
from yolov3_tf2.dataset import transform_images
from yolov3_tf2.utils import draw_outputs
from ..yolo_model import get_yolo_model, get_class_names
from ..yolo_threshold import set_threshold_or_default

def detect_image(img_path, threshold):
    FLAGS.yolo_score_threshold = set_threshold_or_default(threshold)

    with open(img_path, "rb") as file:
        img_raw = tf.image.decode_image(file.read(), channels=3)
        img = tf.expand_dims(img_raw, 0)
        img = transform_images(img, FLAGS.size)
        boxes, scores, classes, nums = get_yolo_model()(img)
        img = img_raw.numpy()
        img = draw_outputs(img, (boxes, scores, classes, nums), get_class_names())
        img = Image.fromarray(img)

    return img
