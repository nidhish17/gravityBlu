import os
from backend.user.database import get_user, add_download
from yt_dlp import YoutubeDL
from backend.youtube.utils import FFMPEG_PATH
from backend.utils.utils import generate_filename
from typing import Callable


class VideoDownloader:
    def __init__(self):
        self.ffmpeg_path = FFMPEG_PATH

    def download_video(self, url, video_info, update_progress: Callable | None = None,
                       download_complete: Callable | None = None):
        # get user
        user = get_user()
        video_quality = user.quality
        save_location = user.user_save_location

        video_is_short = video_info.get("height") > video_info.get("width")
        video_title = video_info.get("videoTitle")
        video_id = video_info.get("videoId")

        # Filename to save
        filename = generate_filename(video_title)

        # To decide on Vcodec
        max_res_obj = video_info.get("max_res")
        video_max_res = max(max_res_obj.get("width"), max_res_obj.get("height"))

        # if the user's selected quality is 1080p then don't care abt the max res just set vcodec to avc
        # if the user's selected quality is 2k or 4k and the max_res is also available to 2k or 4k then set it to av01
        # vcodec = "avc" if video_max_res <= 1920 else "av01" if self.video_quality >= 1440 else "avc"
        if video_max_res >= 2560 and video_quality >= 1440:
            vcodec = "av01"
        else:
            vcodec = "avc"

        def progress_hook(d):
            if d["status"] == "downloading":
                percent = d.get("_percent_str", "").strip()
                speed = d.get("_speed_str", "")
                eta = d.get("_eta_str", "")
                done = d.get("downloaded_bytes", 0)
                total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
                data = {"id": video_id, "progressPercent": percent, "eta": eta, "speed": speed, "downloaded": False,
                        "processing": False, "downloadedBytes": done, "totalBytes": total}
                update_progress(data)
            elif d["status"] == "finished":
                data = {"id": video_id, "downloaded": False, "processing": True}
                download_complete(data)
            else:
                pass

        ydl_opts = self.generate_ydl_ops(video_is_short, vcodec, filename, video_quality, save_location)
        # attach the progress hook to ydl opts
        if update_progress:
            ydl_opts["progress_hooks"] = [progress_hook]
        with YoutubeDL(ydl_opts) as ydl:
            downloaded_info = ydl.extract_info(url, download=True)
            save_loc = os.path.join(save_location, filename)
            filesize = downloaded_info.get("filesize") or downloaded_info.get("filesize_approx")
            try:
                actual_filesize = os.path.getsize(save_loc + ".mp4")
                print(actual_filesize, "actual filesize")
            except Exception as e:
                print(f"An exception {e} occurred")
            title = downloaded_info.get("title")
            thumbnail = downloaded_info.get("thumbnail")
            duration = downloaded_info.get("duration_string")
            resolution = downloaded_info.get("resolution")
            # add the downloaded video info to the database
            add_download(
                title=title,
                filesize=actual_filesize,  # this code here can fail! this variable might be inaccessible
                thumbnail=thumbnail,
                duration=duration,
                save_loc=save_loc,
                resolution=resolution,
                d_type="video"
            )
            print("downloaded", downloaded_info, "downloaded")
            data = {"id": video_id, "downloaded": True, "processing": False}
            # send the data to the frontend indicating that video download has been completed
            if download_complete:
                download_complete(data)

    def generate_ydl_ops(self, is_short, vcodec, filename, video_quality, save_location):
        '''
        generates ydl_options for downloading video
        :param save_location:
        :param is_short: is required to get proper videoquality
        :param vcodec: if the user has selected video quality of 240 upto 1080p, the vcodec is avc else for higher qualities the vcodec is av01
        :param filename:
        :param video_quality:
        :return: returns generated ydl_options for downloading the video
        '''
        ydl_opts = {
            # "external_downloader": str(ARIA2C_PATH),
            # "external_downloader_args": ['-x', '16', '-k', '1M'],  # 16 connections, 1MB chunks
            "forcejson": True,
            "noplaylist": True,
            "format": (
                f"bestvideo[ext=mp4][vcodec^={vcodec}][{'width' if is_short else 'height'}<={video_quality}]+bestaudio[ext=m4a]"
                f"/bestvideo[ext=mp4][{'width' if is_short else 'height'}<={video_quality}]+bestaudio[ext=m4a]"
                f"/best[ext=mp4][{'width' if is_short else 'height'}<={video_quality}]"
                f"/best[ext=mp4]"
            ),
            "ffmpeg_location": self.ffmpeg_path,
            "outtmpl": f"{save_location}/{filename}",
            "updatetime": False,
            "merge_output_format": "mp4",
            # "postprocessor_hooks": [self.postproc_hook] removed this and moved this part after the ydl.download() which does the same thing! for convenience
            # "noprogress": True,
        }

        return ydl_opts


