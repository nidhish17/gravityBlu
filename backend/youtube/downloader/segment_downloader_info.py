from ..ytdlp_config import general_video_ydlopts
from backend.user.database import get_user
from yt_dlp.utils import download_range_func
from ...utils.utils import get_ffmpeg_dir


class SegmentDownloaderInfo:
    def __init__(self):
        pass

    # yt-dlp options for segment downloader
    def ydl_opts(self, video_info: dict, segments: list[dict[str, str | int | float]]) -> dict:
        user = get_user()
        user_video_quality = user.quality
        max_res_obj = video_info.get("max_res")
        vcodec = self.__get_vcodec(max_res_obj, user_video_quality)
        is_short = video_info.get("height") > video_info.get("width")

        segment_ydl_opts = general_video_ydlopts(
            video_info,
            {
                "format": (
                    f"bestvideo[ext=mp4][vcodec^={vcodec}][{'width' if is_short else 'height'}<={user_video_quality}]+bestaudio[ext=m4a]"
                    f"/bestvideo[ext=mp4][{'width' if is_short else 'height'}<={user_video_quality}]+bestaudio[ext=m4a]"
                    f"/best[ext=mp4][{'width' if is_short else 'height'}<={user_video_quality}]"
                    f"/best[ext=mp4]"
                ),
                "download_ranges": download_range_func(None, segments),
                "ffmpeg_location": get_ffmpeg_dir(),
                "force_keyframes_at_cuts": True,
            },
            True,
        )

        return segment_ydl_opts

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
