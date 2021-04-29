from os import environ, path
from dotenv import load_dotenv

load_dotenv(path.join(path.abspath(path.dirname(path.dirname(__file__))), '.env'))

def set_threshold_or_default(threshold):
    return float(environ.get('YOLO_THRESHOLD')) if not threshold else float(threshold)
