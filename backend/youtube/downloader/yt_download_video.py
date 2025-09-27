import os
from backend.user.database import get_user, add_download
from yt_dlp import YoutubeDL
from backend.utils.utils import generate_filename, FFMPEG_PATH
from typing import Callable

from backend.youtube.frontend_comms import Comms


class VideoDownloader:
    def __init__(self):
        self.ffmpeg_path = FFMPEG_PATH
        self.frontend_comms = Comms()

    def get_video_details(self, video_info):
        """
        This is what video_info has
        {
                "videoTitle": str,
                "videoDuration": str,
                "isLive": bool,
                "videoId": str,
                "width": int,
                "height": int,
                "resolution": str,
                "max_res": Object() -> {width: int, height: int, resolution: str},
                "selectedFormat": Object() -> {"height": int|str, "filesize_approx": int|str, "filesize": int|str},
                "thumbnail": str,
        }
        """
        user = get_user()
        user_preferred_quality = user.quality
        user_preferred_save_loc = user.user_save_location

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
        if video_max_res >= 2560 and user_preferred_quality >= 1440:
            vcodec = "av01"
        else:
            vcodec = "avc"

        ydl_opts = self.generate_ydl_ops(video_is_short, vcodec, filename, user_preferred_quality,
                                         user_preferred_save_loc)

        return {
            "video_id": video_id,
            "ydl_opts": ydl_opts,
            "vcodec": vcodec,
            "user": user,
            "filename": filename,
            "user_preferred_save_loc": user_preferred_save_loc
        }

    def save_data_to_db(self, downloaded_info):
        # print("start of downloaded info", downloaded_info, "downloaded_info from save_data_to_db")
        title = downloaded_info.get("title")
        thumbnail = downloaded_info.get("thumbnail")
        duration = downloaded_info.get("duration_string")
        resolution = downloaded_info.get("resolution")
        video_id = downloaded_info.get("videoId")
        filesize = downloaded_info.get("filesize")
        save_loc = downloaded_info.get("filepath")

        add_download(
            title=title,
            filesize=filesize,
            thumbnail=thumbnail,
            duration=duration,
            save_loc=save_loc,
            resolution=resolution,
            d_type="video"
        )

    def download_video(self, url, video_info, update_progress: Callable | None = None,
                       download_complete: Callable | None = None):

        video_details = self.get_video_details(video_info)
        video_id = video_details.get("video_id")

        def progress_hook(d):
            # print("start of info dict progress hook", d, "info dict progress hook")
            if d["status"] == "downloading":
                percent = d.get("_percent_str", "").strip()
                speed = d.get("_speed_str", "")
                eta = d.get("_eta_str", "")
                done = d.get("downloaded_bytes", 0)
                total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
                data = {"id": video_id, "progressPercent": f"{percent}", "eta": f"{eta}", "speed": f"{speed}",
                        "downloaded": False,
                        "processing": False, "downloadedBytes": done, "totalBytes": total}
                update_progress(data)
            # This one dosen't send that the video download has been completed but instead just sends that processing
            # has started and the download_complete status is actually sent by the postprocessor hook which is more reliable
            elif d["status"] == "finished":
                data = {"id": video_id, "downloaded": False, "processing": True}
                download_complete(data)
            else:
                pass

        ydl_opts = video_details.get("ydl_opts")
        filename = video_details.get("filename")
        save_location = video_details.get("user_preferred_save_loc")

        # attach the progress hook to ydl opts
        if update_progress or download_complete:
            ydl_opts["progress_hooks"] = [progress_hook]

        # Download the video here!
        with YoutubeDL(ydl_opts) as ydl:
            downloaded_info = ydl.extract_info(url, download=True)
            save_loc = os.path.join(save_location, filename)

    def post_processor(self, d):
        # print(d)
        status = d.get("status")
        ppname = (d.get("postprocessor") or "").lower()
        info_dict = d.get("info_dict")

        video_id = info_dict.get("id")
        filepath = info_dict.get("filepath")
        filesize = info_dict.get("filesize") or info_dict.get("filesize_approx")
        title = info_dict.get("title")
        thumbnail = info_dict.get("thumbnail")
        duration = info_dict.get("duration_string")
        resolution = info_dict.get("resolution")


        if status == "finished" and ("movefiles" in ppname):
            print("\033[1m FINISHED MERGING \033[0m")
            # call the save to database and also send the data to frontend!
            db_data = {"videoId": video_id, "filepath": filepath, "filesize": filesize, "title": title, "thumbnail": thumbnail, "duration_string": duration, "resolution": resolution}
            frontend_data = {"id": video_id, "downloaded": True, "processing": False}
            self.save_data_to_db(db_data)
            self.frontend_comms.send_download_complete(frontend_data)
            print(f"\033[93m {frontend_data} \033[0m")


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
            "postprocessor_hooks": [self.post_processor],
            "noprogress": True,
            "quiet": True,
            "no_warnings": True,
            "no_color": True
        }

        return ydl_opts

