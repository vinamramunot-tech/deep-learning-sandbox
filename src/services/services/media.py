from abc import ABC, abstractmethod
import base64
import os
import ffmpeg 
from io import BytesIO
from src import app
from ..yolo.image_detection.yolo_image_object_detection import detect_image
from ..yolo.video_detection.yolo_video_object_detection import detect_video

class Media(ABC):
    @abstractmethod
    def get_extensions(self) -> None:
        pass

    @abstractmethod
    def get_upload_path(self) -> None:
        pass

    @abstractmethod
    def create(self, filename, _) -> None:
        pass

    @staticmethod
    def _create_base64_media(image_bytes):
        return base64.encodebytes(image_bytes).decode("utf-8")

    @abstractmethod
    def get_type(self) -> None:
        pass

class ImageMedia(Media):
    def get_extensions(self): return app.config['IMAGE_EXTENSIONS']
    def get_upload_path(self): return app.config['IMAGE_UPLOAD_PATH']
    def get_type(self): return 'image'
    def create(self, filename, threshold):
        img_raw = detect_image(os.path.join(self.get_upload_path(), filename), threshold)
        buffered = BytesIO()
        img_raw.save(buffered, format="PNG")
        return self._create_base64_media(buffered.getvalue())
        
class VideoMedia(Media):
    def get_extensions(self): return app.config['VIDEO_EXTENSIONS']
    def get_upload_path(self): return app.config['VIDEO_UPLOAD_PATH']
    def get_type(self): return 'video'
    def create(self, filename, threshold):
        vid_data = None

        output_file = detect_video(os.path.join(self.get_upload_path(), filename), threshold)
        output_path, output_extension = os.path.splitext(output_file)
        
        stream = ffmpeg.input(output_file)
        final_output = output_path + '-final' + output_extension
        stream = ffmpeg.output(stream, final_output, vcodec='libx264')
        ffmpeg.run(stream)  

        if final_output:
            with open(final_output, "rb") as file:
                vid_data = file.read()

        os.remove(output_file)
        os.remove(final_output)

        return self._create_base64_media(vid_data)

class MediaDetectionFactory:
    @classmethod
    def create_instance(cls, detection_mode):
        detection_options = {
            0: ImageMedia(),
            1: VideoMedia(),
        }
        return detection_options.get(detection_mode, None)
        