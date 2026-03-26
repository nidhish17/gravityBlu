from ..ytdlp_config import general_video_ydlopts, DEBUG_OPTS
from backend.user.database import get_user
from yt_dlp.utils import download_range_func
from ...utils.utils import get_ffmpeg_dir


class SegmentDownloaderInfo:
    def __init__(self):
        pass

    # yt-dlp options for segment downloader
    def ydl_opts(self, video_info: dict, segments: list[dict[str, str|int|float]]) -> dict:
        user = get_user(); user_video_quality = user.quality
        max_res_obj = video_info.get("max_res")
        vcodec = self.__get_vcodec(max_res_obj, user_video_quality)
        is_short = video_info.get("height") > video_info.get("width")


        segment_ydl_opts = general_video_ydlopts(video_info, {
            "format": (
                f"bestvideo[ext=mp4][vcodec^={vcodec}][{'width' if is_short else 'height'}<={user_video_quality}]+bestaudio[ext=m4a]"
                f"/bestvideo[ext=mp4][{'width' if is_short else 'height'}<={user_video_quality}]+bestaudio[ext=m4a]"
                f"/best[ext=mp4][{'width' if is_short else 'height'}<={user_video_quality}]"
                f"/best[ext=mp4]"
            ),
            "download_ranges": download_range_func(None, segments),
            "ffmpeg_location": get_ffmpeg_dir(),
            "force_keyframes_at_cuts": True,
            "postprocessor_hooks": [self.post_processor],
        }, True)

        return segment_ydl_opts


    def post_processor(self, d):
        # print(f"\033[93m Fired! \033[0m")
        print(f"\033[93m {d} \033[0m")

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
            # self.save_data_to_db(db_data)
            # self.comms.send_segment_download_complete(frontend_data)
            print(f"\033[93m {frontend_data} \033[0m")


    @staticmethod
    def __get_vcodec(max_res_obj, quality) -> str:
        video_max_res = max(max_res_obj.get("width"), max_res_obj.get("height"))

        # if the user's selected quality is 1080p then don't care abt the max res just set vcodec to avc
        # if the user's selected quality is 2k or 4k and the max_res is also available to 2k or 4k then set it to av01
        # vcodec = "avc" if video_max_res <= 1920 else "av01" if self.video_quality >= 1440 else "avc"
        # if the user has set 2k as their max res then if a video is not available at 2k then we should auto download it
        # at 1080p or whatever is available. avc format is available for all res up until 1080p.
        vcodec = ""
        if video_max_res >= 2560 and quality >= 1440:
            vcodec = "av01"
        else:
            vcodec = "avc"

        return vcodec


