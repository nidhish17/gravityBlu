import os
from collections.abc import Callable
from functools import partial

from backend.user.database import get_user, add_download
from yt_dlp import YoutubeDL

from backend.utils.utils import generate_filename, FFMPEG_PATH


class AudioDownloader:
    def __init__(self):
        self.ffmpeg_path = FFMPEG_PATH

    def download_audio(self, url, video_title, update_progress: Callable | None = None, download_complete: Callable | None = None):
        filename = generate_filename(video_title)
        user = get_user()
        save_location = user.user_save_location
        ydl_opts = self.generate_ydl_opts(filename, save_location)

        if update_progress:
            update_progress_handler = partial(self.progress_hook, update_progress, download_complete)
            ydl_opts["progress_hooks"] = [update_progress_handler]


        with YoutubeDL(ydl_opts) as ydl:
            downloaded_info = ydl.extract_info(url, download=True)
            # save the download to the database
            save_loc = os.path.join(save_location, filename)
            filesize = downloaded_info.get("filesize_approx", "")
            title = downloaded_info.get("title")
            thumbnail = downloaded_info.get("thumbnail")
            duration = downloaded_info.get("duration_string")
            resolution = downloaded_info.get("resolution")
            video_id = downloaded_info.get("id")
            add_download(
                d_type="audio",
                title=title,
                filesize=filesize,
                thumbnail=thumbnail,
                duration=duration,
                save_loc=save_loc,
                resolution=resolution,
            )
            data = {"id": f"{video_id}audio", "downloaded": True, "processing": False}
            # send data to frontend
            download_complete(data)
            # save the downloaded information here!
            # add_download() -> call to database with information about video
            # params: { videoTitle, duration, savelocation:,  }

    def progress_hook(self, update_progress: Callable, download_complete: Callable, d):
        video_id = d.get("info_dict").get("id")
        # print(video_id)
        if d.get("status") == "downloading":
            percent = d.get("_percent_str", "").strip()
            speed = d.get("_speed_str", "")
            eta = d.get("_eta_str", "")
            done = d.get("downloaded_bytes", 0)
            total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
            data = {"id": f"{video_id}audio", "progressPercent": str(percent), "eta": str(eta), "speed": str(speed), "downloaded": False,
                    "processing": False, "downloadedBytes": done, "totalBytes": total}
            update_progress(data)
        elif d.get("status") == "finished":
            data = {"id": f"{video_id}audio", "downloaded": False, "processing": True}
            download_complete(data)


    def generate_ydl_opts(self, filename, save_location):

        ydl_opts = {
            "outtmpl": os.path.join(save_location, filename),
            "forcejson": True,
            "noplaylist": True,
            "format": "bestaudio[ext=m4a]/best",
            "ffmpeg_location": self.ffmpeg_path,
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "0"
            }],
            "merge_output_format": "mp3",
            "no_color": True,
            "noprogress": True,
            "quiet": True,
            "no_warnings": True
        }

        return ydl_opts


# audio_downloader = AudioDownloader()
# we_pray = "https://youtu.be/5Rmyb8GLMaM?si=sZJNnOjHo8xSSAqb"
# audio_downloader.download_audio(we_pray)
