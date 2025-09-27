from threading import Lock
import json
import webview

# there are multiple videos being downloaded at once so to prevent issues use a lock!
comms_lock = Lock()


class Comms:

    def send_download_progress(self, data):
        try:
            with comms_lock:
                webview.windows[0].evaluate_js(f"updateProgressFromPy({json.dumps(data)})")
        except Exception as e:
            print(f"An error occurred while sending download progress to frontend\nError:\n\t\t{e}")


    def send_download_complete(self, data):
        try:
            with comms_lock:
                webview.windows[0].evaluate_js(f"videoDownloadComplete({json.dumps(data)})")
        except Exception as e:
            print(f"An error occurred while sending download complete status to frontend\nError:\n\t\t{e}")



