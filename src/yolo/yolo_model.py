from absl.flags import FLAGS
from yolov3_tf2.models import YoloV3
from .yolo_config import YoloConfig

k = YoloConfig()
k.set_general_flags()

__yolo = YoloV3(classes=FLAGS.num_classes)
__class_names = [c.strip() for c in open(FLAGS.classes).readlines()]
__yolo.load_weights(FLAGS.weights).expect_partial()

def get_yolo_model(): return __yolo
def get_class_names(): return __class_names
