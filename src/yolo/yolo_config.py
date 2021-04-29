import sys
from absl import flags
from absl.flags import FLAGS

FILENAME_CLASSES = './src/yolo_weights/coco.names'
FILENAME_CONVERTED_WEIGHTS = './src/yolo_weights/checkpoints/yolov3.tf'

class YoloConfig():
    def set_general_flags(self):
        flags.DEFINE_string('classes', FILENAME_CLASSES, 'path to classes file')
        flags.DEFINE_string('weights', FILENAME_CONVERTED_WEIGHTS, 'path to weights file')
        flags.DEFINE_integer('num_classes', 80, 'number of classes in the model')
        FLAGS([sys.argv[0]])

