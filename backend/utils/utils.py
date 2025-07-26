import time
import os
import sys
from pathlib import Path

# App version
__VERSION__ = "2.0.0"

APP_WIDTH=1280
APP_HEIGHT=770
MIN_APP_WIDTH=1280
MIN_APP_HEIGHT=770

# this var is same on the updater.exe too which it relies on to replace the app after updating. ref -> APP_NAME (in gravity_blu_updater.py)
FINAL_APP_NAME_ON_DISK = "GravityBlu.exe"
APP_NAME = "GravityBlu"

def get_ffmpeg_path():
    if getattr(sys, "frozen", False):
        base_path = Path(sys.executable).parent
    else:
        base_path = Path(__file__).resolve().parents[2]

    return str(base_path / "ffmpeg" / "ffmpeg.exe")


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFMPEG_PATH = get_ffmpeg_path()

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

