# Build:

1. Run build.py `python build.py or python3 build.py`:
  1. Downloads yolov3\_tf2
  2. Download external YOLO weights, yolov3.cfg, coco.names and convert.py under yolo\_weights directory
  3. Convert pre-trained Darknet weights yolov3.weights to YOLO model yolov3.tf
  4. Create a faceapi model directory if it doesn&#39;t exist
  5. Download faceapi models (json file), weights for those respective models:
      1. Face landmark 68
      2. Face recognition
      3. MTCNN
      4. SSD_MobileNetv1
      5. Tiny face detector (YOLO v2)