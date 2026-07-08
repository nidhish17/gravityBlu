import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import webview
from backend.utils.utils import APP_NAME, APP_WIDTH, APP_HEIGHT, MIN_APP_WIDTH, MIN_APP_HEIGHT
from backend.main import DownloaderApi
import pystray
from PIL import Image


### -------------------------------------use google dns------------------------------------- ###
import socket
import dns.resolver  # pip install dnspython

# one resolver, hard-wired to Google DNS
_res = dns.resolver.Resolver(configure=False)
_res.nameservers = ["8.8.8.8"]  # 1.1.1.1 also fine

_orig = socket.getaddrinfo  # for fallback


def fast_dns(host, port, family=0, type=0, proto=0, flags=0):
    try:  # ask Google DNS
        ip = _res.resolve(host, "A", lifetime=2)[0].to_text()
        return [(socket.AF_INET, socket.SOCK_STREAM, proto, "", (ip, port))]
    except Exception:  # on failure, use OS resolver
        return _orig(host, port, family, type, proto, flags)


socket.getaddrinfo = fast_dns  # ←  installs the patch
### ----------------------------------------------------------------------------------------- ###


def app():
    api = DownloaderApi()

    app_window = webview.create_window(
        title=APP_NAME,
        url="http://localhost:5173/",
        height=APP_HEIGHT,
        width=APP_WIDTH,
        min_size=(MIN_APP_WIDTH, MIN_APP_HEIGHT),
        js_api=api,
    )

    def on_closing():
        app_window.hide()
        return False

    app_window.events.closing += on_closing

    # Global flag to prevent multiple tray icons on page reloads
    tray_setup_done = False

    def setup_tray():
        nonlocal tray_setup_done
        if tray_setup_done:
            return

        try:
            image_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "icon.png")
            image = Image.open(image_path)

            def show_window(icon, item):
                app_window.show()

            def nav_download(icon, item):
                app_window.show()
                app_window.evaluate_js("if(window.changeTab) window.changeTab('download');")

            def nav_downloading(icon, item):
                app_window.show()
                app_window.evaluate_js("if(window.changeTab) window.changeTab('downloading');")

            def nav_downloads(icon, item):
                app_window.show()
                app_window.evaluate_js("if(window.changeTab) window.changeTab('finished');")

            def exit_app(icon, item):
                icon.stop()
                app_window.destroy()
                os._exit(0)

            menu = pystray.Menu(
                pystray.MenuItem("Open GravityBlu", show_window, default=True),
                pystray.MenuItem("Download", nav_download),
                pystray.MenuItem("Downloading", nav_downloading),
                pystray.MenuItem("Downloads", nav_downloads),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("Exit", exit_app),
            )

            icon = pystray.Icon("gravityBlu", image, "gravityBlu", menu)
            icon.run_detached()
            tray_setup_done = True
        except Exception as e:
            print(f"Failed to setup system tray: {e}")

    app_window.events.loaded += setup_tray

    webview.start(debug=True)


# def on_closing():
#     return askyesno(
#         message="Downloads are still in progress. If you close now, incomplete video fragments may be left behind.\n\nAre you sure you want to exit?",
#         title="videos downloading",
# )


def check_ytdlp_ver():
    import requests
    import importlib.metadata

    package_name = "yt-dlp"
    url = "https://pypi.org/pypi/yt-dlp/json"

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        latest_version = response.json()["info"]["version"]
        installed = importlib.metadata.version("yt-dlp")

        if latest_version != installed:
            print("New version of yt-dlp is available")
        else:
            print(f"latest version of {package_name} is installed")

    except requests.RequestException as e:
        print("Error checking yt-dlp version:", e)


if __name__ == "__main__":
    check_ytdlp_ver()
    app()


# todo: work on this error
#  WARNING: [youtube] UxXY_hR_wzo: Some tv client https formats have been skipped as they are DRM protected. The current session may have an experiment that applies DRM to all videos on the tv client. See  https://github.com/yt-dlp/yt-dlp/issues/12563  for more details.
#  [youtube] UxXY_hR_wzo: Downloading m3u8 information
#  WARNING: [youtube] UxXY_hR_wzo: Some web client https formats have been skipped as they are missing a url. YouTube is forcing SABR streaming for this client. See  https://github.com/yt-dlp/yt-dlp/issues/12482  for more details

# todo: cookies error
#  detect this error - yt_dlp.utils.DownloadError: ERROR: [youtube] _qDML_BCju8: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication. See  https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp  for how to manually pass cookies. Also see  https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies  for tips on effectively exporting YouTube cookies

# todo: small bug (will be fixed in later versions (not a critical one))
#  if you try to download same two videos then theres a conflict between the ids of the video and progress being
#  updated so two videos will get the same progress and will be popped off!

# todo (Fulfilled): send finished downloading after the poset processing!
#  when post processing then display merging video or processing and then pop it off ie send downloaded status!

# todo bug (FIXED): if user changes quality then the downloaded video is not the same quality the user chose even if the
#  video's res is available ie due to init/variable being read during init phase and that being accessed everytime and not the current quality that the user selected!

# make it add without the folders!
