from yt_dlp import YoutubeDL
from backend.user.database import User
from yt_dlp.utils import DownloadError
from backend.youtube.ytdlp_config import get_opts
# db = TinyDB("video_info.json")

class VideoInformation:
    def __init__(self):
        self.user = User.get(id=1)

    def get_info(self, url):
        ydl_opts = self.get_ydl_opts(User.get(id=1).quality)
        with YoutubeDL(ydl_opts) as ydl:
            video_info = ydl.extract_info(url, download=False)
            preview_url = self.get_preview_url(url)
            # db.insert(video_info)
            try:
                selected_format = video_info.get("requested_formats")[0]
            except DownloadError:
                selected_format = {}
                raise
            except Exception as e:
                raise
            info_obj = {
                "videoTitle": video_info.get("title"),
                "videoDuration": video_info.get("duration_string"),
                "isLive": video_info.get("is_live"),
                "videoId": video_info.get("id"),
                "width": video_info.get("width"),
                "height": video_info.get("height"),
                "resolution": video_info.get("resolution"),
                "max_res": self.get_max_res(video_info.get("formats")),
                "selectedFormat": {"height": selected_format.get("height", ""),
                                   "filesize_approx": selected_format.get("filesize_approx", ""),
                                   "filesize": selected_format.get("filesize", "")},
                "thumbnail": video_info.get("thumbnail"),
                "streaming_url": preview_url,
                "durationSeconds": video_info.get("duration"),
            # "formats": self.video_formats(video_info.get("formats"))
            }

            return info_obj

    def get_ydl_opts(self, video_quality):
        return get_opts({
            "format": (
                f"bestvideo[ext=mp4]{'[vcodec^=av01]' if video_quality >= 1440 else '[vcodec^=avc]'}[height<={video_quality}]+bestaudio[ext=m4a]"
                f"/bestvideo[ext=mp4][height<={video_quality}]+bestaudio[ext=m4a]"
                f"/best[ext=mp4][height<={video_quality}]"
                f"/best[ext=mp4]"
            ),
        })

    def get_preview_url(self, url):
        preview_quality = 720
        ydl_opts = get_opts({
            "format": f"best[ext=mp4][height<={preview_quality}]/best[ext=mp4]"
        })
        with YoutubeDL(ydl_opts) as ydl:
            video_info = ydl.extract_info(url, download=False)
            return video_info.get("url")

    def video_formats(self, formats):
        hd_formats = []
        high_res_formats = []

        # get only avc formats for 1080p
        for fmt in formats:
            vcodec: str = fmt.get("vcodec")
            height = fmt.get("height")
            width = fmt.get("width")
            if (vcodec.startswith("avc")):
                hd_formats.append(fmt)
            elif (vcodec.startswith("vp9") or vcodec.startswith("vp09") or vcodec.startswith("av01") and max(height, width) >= 2560):
                high_res_formats.append(fmt)

        return {"hdFormats": hd_formats, "highResFormats": high_res_formats}

    def get_max_res(self, formats):
        max_res_format = formats[-1]
        height = max_res_format.get("height")
        width = max_res_format.get("width")
        resolution = max_res_format.get("resolution")
        return {"width": width, "height": height, "resolution": resolution}

# info = VideoInformation()
# info.get_info("https://youtu.be/eXOqM045EIY?si=fgRUTXOqvA_Aa3bb")
