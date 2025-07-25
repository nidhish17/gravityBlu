import time
import os
from backend.youtube.utils import APP_NAME

APP_WIDTH=1280
APP_HEIGHT=770
MIN_APP_WIDTH=1280
MIN_APP_HEIGHT=770

# this var is same on the updater.exe too which it relies on to replace the app after updating. ref -> APP_NAME (in gravity_blu_updater.py)
FINAL_APP_NAME_ON_DISK = "GravityBlu.exe"

__VERSION__ = "2.0.0"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPDATER_LOCATION = os.path.join(BASE_DIR, "updater", "updater.exe")

def sanitize_title(yt_title):
    filename = yt_title
    invalid_chars = ["|", ">", "<", ":", '"', "/", "\\", "*", "?"]
    for char in invalid_chars:
        if char in filename:
            filename = filename.replace(char, "")
    return filename

def generate_filename(title):
    sanitized_title = sanitize_title(title)
    return f"{sanitized_title}[{APP_NAME}][{int(time.time() * 1000)}]"

