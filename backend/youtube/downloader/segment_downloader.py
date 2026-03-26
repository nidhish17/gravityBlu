import os
import pprint

from yt_dlp import YoutubeDL
from backend.status import Status
from backend.youtube.downloader.segment_downloader_info import SegmentDownloaderInfo
from backend.youtube.details import VideoInformation
from backend.youtube.frontend_comms import Comms


class SegmentDownloader:
    def __init__(self):
        self.video_info = VideoInformation()
        self.segment_downloader_info = SegmentDownloaderInfo()
        self.comms = Comms()

    def download_segments(self, data: dict[str, str|list]):
        url = data.get("url")
        segments = data.get("segments")
        video_info = self.video_info.get_info(url)
        ydl_opts = self.segment_downloader_info.ydl_opts(video_info, self.__parse_segments(segments))

        print(f"Segments: {segments}")

        ffmpeg_dir = ydl_opts.get("ffmpeg_location", "")
        if ffmpeg_dir and ffmpeg_dir not in os.environ.get("PATH", ""):
            print("FFMPEG was not in PATH, adding it now...")
            os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

        # pprint.pprint(ydl_opts)

        with YoutubeDL(ydl_opts) as ydl:
            try:
                pass
                downloaded_info = ydl.download([url])
                pprint.pprint(downloaded_info)
                self.comms.send_segment_download_complete({"downloaded": True, "id": video_info.get("videoId"), "processing": False})
            except Exception as err:
                print(f"An unexpected error occurred {err}")
                raise Exception("An error occurred while downloading the segments, please try again later.")

        return {
            "message": "Downloaded",
            "ok": Status.SUCCESS.value,
            "status_code": 200
        }


    def __parse_segments(self, segments):
        parsed_segments = []
        if not segments:
            raise Exception("Segments are not specified!")

        for segment in segments:
            start_time = segment.get("startTime")
            end_time = segment.get("endTime")
            parsed_segments.append(
                (start_time, end_time)
            )

        return parsed_segments

'''
    - save a thumbnail to the folder so it is easy accessible / generates preview
    - we only save the segment folder location where the segments are located and redirect user to that folder when they click on
     open file loc.
'''

# testUrl = "https://youtu.be/IPB5xEaZgx8?si=Uyp7wTCfgQxANutZ"
# downloader = SegmentDownloader()
#
# data = {
#     "url": testUrl,
#     "segments": [
#         {"startTime": 100, "endTime": 150},
#         # {"startTime": 20, "endTime": 25},
#     ]
# }
# downloader.download_segments(data)




