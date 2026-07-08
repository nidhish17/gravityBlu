import os
from backend.user.database import get_user, add_download
from yt_dlp import YoutubeDL
from backend.utils.utils import generate_filename, FFMPEG_PATH
from typing import Callable

from backend.youtube.frontend_comms import Comms
from yt_dlp.utils import DownloadError
from backend.youtube.ytdlp_config import get_opts


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
        # if the user has set 2k as their max res then if a video is not available at 2k then we should auto download it
        # at 1080p or whatever is available. avc format is available for all res up until 1080p.
        if video_max_res >= 2560 and user_preferred_quality >= 1440:
            vcodec = "av01"
        else:
            vcodec = "avc"

        ydl_opts = self.generate_ydl_ops(
            video_is_short, vcodec, filename, user_preferred_quality, user_preferred_save_loc
        )

        return {
            "video_id": video_id,
            "ydl_opts": ydl_opts,
            "vcodec": vcodec,
            "user": user,
            "filename": filename,
            "user_preferred_save_loc": user_preferred_save_loc,
        }

    def save_data_to_db(self, downloaded_info):
        # print("start of downloaded info", downloaded_info, "downloaded_info from save_data_to_db")
        title = downloaded_info.get("title")
        thumbnail = downloaded_info.get("thumbnail")
        duration = downloaded_info.get("duration_string")
        resolution = downloaded_info.get("resolution")
        downloaded_info.get("videoId")
        filesize = downloaded_info.get("filesize")
        save_loc = downloaded_info.get("filepath")

        add_download(
            title=title,
            filesize=filesize,
            thumbnail=thumbnail,
            duration=duration,
            save_loc=save_loc,
            resolution=resolution,
            d_type="video",
        )

    def download_video(
        self, url, video_info, update_progress: Callable | None = None, download_complete: Callable | None = None
    ):

        video_details = self.get_video_details(video_info)
        video_id = video_details.get("video_id")

        def progress_hook(d):
            import time
            from backend.youtube.downloader.download_state import download_states

            while True:
                state = download_states.get(video_id, "downloading")
                if state == "cancelled":
                    raise Exception("Download cancelled by user.")
                elif state == "paused":
                    time.sleep(1)
                else:
                    break

            if d["status"] == "downloading":
                percent = d.get("_percent_str", "").strip()
                speed = d.get("_speed_str", "")
                eta = d.get("_eta_str", "")
                done = d.get("downloaded_bytes", 0)
                total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
                data = {
                    "id": video_id,
                    "progressPercent": f"{percent}",
                    "eta": f"{eta}",
                    "speed": f"{speed}",
                    "downloaded": False,
                    "processing": False,
                    "downloadedBytes": done,
                    "totalBytes": total,
                    "paused": False,
                }
                update_progress(data)
            else:
                pass

        def postprocessor_hook(d):
            if d["status"] == "started":
                data = {"id": video_id, "downloaded": False, "processing": True}
                if download_complete:
                    download_complete(data)

        ydl_opts = video_details.get("ydl_opts")
        filename = video_details.get("filename")
        save_location = video_details.get("user_preferred_save_loc")

        # attach the progress hook to ydl opts
        if update_progress or download_complete:
            ydl_opts["progress_hooks"] = [progress_hook]
            ydl_opts["postprocessor_hooks"] = [postprocessor_hook]

        # Pre-fetch formats to construct dynamic audio format string without duplicates
        try:
            with YoutubeDL({"quiet": True}) as info_ydl:
                pre_info = info_ydl.extract_info(url, download=False)
                formats = pre_info.get("formats", [])

                # group by language and pick highest quality (tbr/abr)
                langs = {}
                for f in formats:
                    if f.get("vcodec") == "none" and f.get("acodec") != "none":
                        lang = f.get("language") or "default"
                        tbr = f.get("tbr") or f.get("abr") or 0
                        current_best = langs.get(lang)
                        if not current_best or tbr > (current_best.get("tbr") or current_best.get("abr") or 0):
                            langs[lang] = f

                audio_format_ids = [f["format_id"] for f in langs.values()]
                if audio_format_ids:
                    audio_str = "+".join(audio_format_ids)
                    ydl_opts["format"] = ydl_opts["format"].replace("mergeall[vcodec=none]", audio_str)
                else:
                    ydl_opts["format"] = ydl_opts["format"].replace("mergeall[vcodec=none]", "bestaudio[ext=m4a]")
        except Exception as e:
            print(f"Failed to pre-fetch audio formats: {e}")
            ydl_opts["format"] = ydl_opts["format"].replace("mergeall[vcodec=none]", "bestaudio[ext=m4a]")

        # Download the video here!
        with YoutubeDL(ydl_opts) as ydl:
            try:
                downloaded_info = ydl.extract_info(url, download=True)
                save_loc = os.path.join(save_location, filename)

                # Retrieve final details for database
                final_filesize = downloaded_info.get("filesize") or downloaded_info.get("filesize_approx", 0)

                # Since we changed merge_output_format to mp4, the final file will be an .mp4.
                final_filepath = f"{os.path.normpath(save_loc)}.mp4"

                db_data = {
                    "videoId": video_id,
                    "filepath": final_filepath,
                    "filesize": final_filesize,
                    "title": downloaded_info.get("title", ""),
                    "thumbnail": downloaded_info.get("thumbnail", ""),
                    "duration_string": downloaded_info.get("duration_string", ""),
                    "resolution": downloaded_info.get("resolution", ""),
                }

                print("\033[1m FINISHED MERGING \033[0m")
                self.save_data_to_db(db_data)
                if self.frontend_comms:
                    self.frontend_comms.send_download_complete(
                        {"id": video_id, "downloaded": True, "processing": False}
                    )

            except DownloadError as e:
                error_msg = str(e).lower()
                if "sign in to confirm your age" in error_msg or "confirm your age" in error_msg:
                    print("Age restricted video")
                    raise Exception("Age-Restricted video cannot be downloaded!")
                else:
                    # Re-raise the exception so downloader_api.py can catch it and send the error to the UI
                    raise e

    def generate_ydl_ops(self, is_short, vcodec, filename, video_quality, save_location):
        """
        generates ydl_options for downloading video
        :param save_location:
        :param is_short: is required to get proper videoquality
        :param vcodec: if the user has selected video quality of 240 upto 1080p, the vcodec is avc else for higher qualities the vcodec is av01
        :param filename:
        :param video_quality:

        :return: returns generated ydl_options for downloading the video
        """
        ydl_opts = get_opts(
            {
                # "external_downloader": str(ARIA2C_PATH),
                # "external_downloader_args": ['-x', '16', '-k', '1M'],  # 16 connections, 1MB chunks
                "format": (
                    f"bestvideo[ext=mp4][vcodec^={vcodec}][{'width' if is_short else 'height'}<={video_quality}]+mergeall[vcodec=none]"
                    f"/bestvideo[ext=mp4][{'width' if is_short else 'height'}<={video_quality}]+mergeall[vcodec=none]"
                    f"/best[ext=mp4][{'width' if is_short else 'height'}<={video_quality}]"
                    f"/best[ext=mp4]"
                ),
                "allow_multiple_audio_streams": True,
                "ffmpeg_location": self.ffmpeg_path,
                "outtmpl": f"{save_location}/{filename}.%(ext)s",
                "updatetime": False,
                "merge_output_format": "mp4",
                "writesubtitles": True,
                "subtitleslangs": ["all"],
                "postprocessors": [{"key": "FFmpegEmbedSubtitle"}],
                "compat_opts": ["no-keep-subs"],
            }
        )

        return ydl_opts
