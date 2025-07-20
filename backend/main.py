from updater.app_updater import AppUpdate
from backend.status import Status
from backend.user.database import init_db
from backend.user.defaultSettings import DefaultSettings
from backend.user.save_loc import SaveLocation
from backend.youtube.download_catalog import DownloadCatalog
from backend.youtube.downloader.downloader_api import YoutubeDownloader
import subprocess
import os
import sys

class DownloaderApi:
    def __init__(self):
        init_db()
        self.location = SaveLocation()
        self.default = DefaultSettings()
        self.yt_api = YoutubeDownloader()
        self.catalog = DownloadCatalog()
        self.updates = AppUpdate()

    def open_file_location(self, location):
        try:
            # only works for windows for now
            if sys.platform == "win32":
                subprocess.Popen(f'explorer /select, {os.path.realpath(location)}')
            # return {"message": "Opening...", "status_code": 200}
            return {
                "ok": True,
                "status": Status.SUCCESS.value,
                "data": {
                    "message": "opening file location"
                }
            }
        except Exception as err:
            return {
                "ok": False,
                "status": Status.ERROR.value,
                "data": {
                    "message": "failed opening file location",
                    "error": str(err)
                }
            }
            # return {"message": f"An error occurred: {e}", "status_code": 500}

    def about(self):
        return {
            "developer": "Nico An",
            "license": "GNU",
            "app_name": "gravityBlu",
            "version": "2.0.0"
        }

