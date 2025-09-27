from backend.status import Status
from backend.youtube.downloader.yt_download_audio import AudioDownloader
from backend.youtube.downloader.yt_download_video import VideoDownloader
from backend.user.save_loc import SaveLocation
import threading
from backend.youtube.details import VideoInformation
import webview
from threading import Lock
import json

js_call_lock = Lock()

class YoutubeDownloader:
    def __init__(self):
        self.yt_video_downloader = VideoDownloader()
        self.yt_audio_downloader = AudioDownloader()
        self.save_loc = SaveLocation()
        self.info = VideoInformation()

    def send_download_progress(self, data):
        with js_call_lock:
            # self.progress_callback(data)
            webview.windows[0].evaluate_js(f"updateProgressFromPy({json.dumps(data)})")

    def send_download_complete(self, data):
        print("sending: ", data)
        with js_call_lock:
            webview.windows[0].evaluate_js(f"videoDownloadComplete({json.dumps(data)})")

    def send_download_error(self, data):
        print("sending error", data)
        with js_call_lock:
            webview.windows[0].evaluate_js(f"downloadError({json.dumps(data)})")

    def download_yt_video(self, url):
        # if the user has not specified the location return immediately
        if not self.save_loc.get_user_save_loc()["specified"]:
            data = self.save_loc.specify_location()
            if not data.get("specified"):
                print("Video won't be downloaded please specify location to download")
                return {
                    "ok": False,
                    **data
                }

        video_info = self.info.get_info(url)
        vid_meta = {
            "id": video_info.get("videoId"),
            "url": url,
            "title": video_info.get("videoTitle")
        }

        def download_task():
            try:
                self.yt_video_downloader.download_video(url, video_info, self.send_download_progress, self.send_download_complete)
                return {
                    "status": Status.SUCCESS.value,
                    "ok": True,
                    "data": {
                        "message": "video downloaded",
                    }
                }
            except Exception as err:
                self.send_download_error({
                    "ok": False,
                    "status": Status.ERROR.value,
                    "details": str(err),
                    "metadata": vid_meta
                })
                return {
                    "ok": False,
                    "status": Status.ERROR.value,
                    "details": str(err)
                }

        threading.Thread(target=download_task).start()

        return {
            "ok": True,
            "status": Status.PENDING.value,
            "data": {
                "message": "Download Started",
                "downloadStarted": True,
                "videoInformation": video_info
            }
        }

    def download_yt_audio(self, url):
        if not self.save_loc.get_user_save_loc()["specified"]:
            data = self.save_loc.specify_location()
            if not data.get("specified"):
                # print("Video won't be downloaded please specify location to download")
                return {
                    "ok": False,
                    **data
                }

        video_info = self.info.get_info(url)
        video_info["videoId"] = f"{video_info.get('videoId')}audio"

        def download_task():
            video_title = video_info.get("videoTitle")
            print(video_title, "video title from python")
            try:
                self.yt_audio_downloader.download_audio(url, video_title, self.send_download_progress, self.send_download_complete)
            except Exception as err:
                print(err)
                print(video_info.get("videoId"))
                aud_meta = {
                    "id": video_info.get("videoId"),
                    "title": video_title,
                    "url": url,
                }
                self.send_download_error({
                    "ok": False,
                    "status": Status.ERROR.value,
                    "details": str(err),
                    "metadata": aud_meta
                })
                return {
                    "ok": False,
                    "status": Status.ERROR.value,
                    "details": str(err)
                }

        threading.Thread(target=download_task).start()

        return {
            "ok": True,
            "status": Status.PENDING.value,
            "data": {
                "message": "Download Started",
                "downloadStarted": True,
                "videoInformation": video_info
            }
        }


# youtube_downloader = YoutubeDownloader()

# short_video_4k = "https://www.youtube.com/watch?v=eHZk8SqDLkY"
# new_woman = "https://www.youtube.com/watch?v=UxXY_hR_wzo"
# one_spark = "https://www.youtube.com/watch?v=jCzez_q8si0"
# short_video = "https://youtube.com/shorts/sN4rJMKWUnk?si=DF-e_IWTX54hWafu"
# i_got_u = "https://www.youtube.com/watch?v=haf67eKF0uo"

# youtube_downloader.download_yt_video(new_woman)
# youtube_downloader.download_yt_video(short_video_4k)
# youtube_downloader.download_yt_video(one_spark)
# youtube_downloader.download_yt_video(i_got_u)
# youtube_downloader.download_yt_video(short_video)
