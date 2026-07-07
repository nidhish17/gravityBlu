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
        merge_segments = data.get("merge_segments", True)
        video_info = self.video_info.get_info(url)
        parsed_segments = self.__parse_segments(segments)
        ydl_opts = self.segment_downloader_info.ydl_opts(video_info, parsed_segments)

        print(f"Segments: {segments}, Merge: {merge_segments}")

        from backend.utils.utils import get_ffmpeg_dir, get_ffmpeg_path
        ffmpeg_dir = get_ffmpeg_dir()
        if ffmpeg_dir not in os.environ.get("PATH", ""):
            print("FFMPEG was not in PATH, adding it now...")
            os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

        # Extract base path from outtmpl
        outtmpl = ydl_opts.get("outtmpl", "")
        base_path = outtmpl.split("_%(section_start)s")[0]
        ext = ydl_opts.get("merge_output_format", "mp4")

        with YoutubeDL(ydl_opts) as ydl:
            try:
                ydl.download([url])
                
                # After download, handle the files
                import glob
                import subprocess
                from backend.user.database import add_download
                
                # Get all downloaded segment files
                segment_files = []
                for (start, end) in parsed_segments:
                    # yt-dlp formats start/end as ints if they are whole numbers
                    start_str = str(int(start)) if start == int(start) else str(start)
                    end_str = str(int(end)) if end == int(end) else str(end)
                    expected_path = f"{base_path}_{start_str}-{end_str}.{ext}"
                    if os.path.exists(expected_path):
                        segment_files.append(expected_path)
                    else:
                        # Fallback glob in case formatting differs slightly
                        matches = glob.glob(f"{base_path}_{start_str}*.{ext}")
                        if matches:
                            segment_files.append(matches[0])

                if not segment_files:
                    raise Exception("No segment files found after download!")

                final_save_loc = base_path
                filesize = sum(os.path.getsize(f) for f in segment_files)
                
                if merge_segments and len(segment_files) > 1:
                    final_path = f"{base_path}_merged.{ext}"
                    concat_file = f"{base_path}_concat.txt"
                    
                    with open(concat_file, "w", encoding="utf-8") as f:
                        for sf in segment_files:
                            # ffmpeg requires forward slashes or escaped backslashes in concat file
                            safe_path = sf.replace("\\", "/")
                            f.write(f"file '{safe_path}'\n")
                    
                    print("Merging segments...")
                    subprocess.run(
                        [get_ffmpeg_path(), "-y", "-f", "concat", "-safe", "0", "-i", concat_file, "-c", "copy", final_path],
                        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
                    )
                    
                    # Clean up individual segments and concat file
                    os.remove(concat_file)
                    for sf in segment_files:
                        try:
                            os.remove(sf)
                        except: pass
                        
                    final_save_loc = final_path
                    filesize = os.path.getsize(final_path)
                elif len(segment_files) == 1:
                    # If only 1 segment, just use it (rename without start-end suffix)
                    final_path = f"{base_path}.{ext}"
                    if os.path.exists(final_path):
                        os.remove(final_path)
                    os.rename(segment_files[0], final_path)
                    final_save_loc = final_path
                else:
                    # Not merging, save directory path
                    final_save_loc = os.path.dirname(base_path)
                
                # Add to database for "Finished" tab
                add_download(
                    d_type="segment",
                    title=video_info.get("videoTitle", "Segment Download"),
                    duration=video_info.get("videoDuration", ""),
                    resolution=video_info.get("resolution", ""),
                    thumbnail=video_info.get("thumbnail", ""),
                    filesize=filesize,
                    save_loc=final_save_loc
                )

                self.comms.send_segment_download_complete({"downloaded": True, "id": video_info.get("videoId"), "processing": False})
            except Exception as err:
                print(f"An unexpected error occurred {err}")
                raise Exception(f"An error occurred while downloading the segments: {err}")

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




