### -------------------------------------use google dns------------------------------------- ###
import os.path
import socket, dns.resolver              # pip install dnspython
# one resolver, hard-wired to Google DNS
_res = dns.resolver.Resolver(configure=False)
_res.nameservers = ['8.8.8.8']           # 1.1.1.1 also fine

_orig = socket.getaddrinfo               # for fallback

def fast_dns(host, port, family=0, type=0, proto=0, flags=0):
    try:                                 # ask Google DNS
        ip = _res.resolve(host, 'A', lifetime=2)[0].to_text()
        return [(socket.AF_INET, socket.SOCK_STREAM,
                 proto, '', (ip, port))]
    except Exception:                    # on failure, use OS resolver
        return _orig(host, port, family, type, proto, flags)

socket.getaddrinfo = fast_dns            # ←  installs the patch
### ----------------------------------------------------------------------------------------- ###

import webview
from utils.utils import APP_NAME
from backend.utils.utils import APP_WIDTH, APP_HEIGHT, MIN_APP_WIDTH, MIN_APP_HEIGHT
from main import DownloaderApi

# ------------------------------------ prevent user from opening multiple instances of my app ------------------------------------ #
import win32event
import win32api
import sys
import pygetwindow as gw

mutex = win32event.CreateMutex(None, False, "gravityBluAppInstanceLock")

# Focus on the window that is already open
win = gw.getWindowsWithTitle(APP_NAME)
if win:
    win[0].activate()

# close the window / prevent the user from opening multiple instances of the app
last_error = win32api.GetLastError()
if last_error == 183:
    sys.exit(0)

# ------------------------------------ prevent user from opening multiple instances of my app ------------------------------------ #

def app():
    api = DownloaderApi()
    base_dir = os.path.abspath("frontend_production")
    frontend_index_file_path = os.path.join(base_dir, "index.html")
    print(frontend_index_file_path)
    app_window = webview.create_window(
        title=APP_NAME,
        url=f"file://{frontend_index_file_path}",
        height=APP_HEIGHT,
        width=APP_WIDTH,
        min_size=(MIN_APP_WIDTH, MIN_APP_HEIGHT),
        js_api=api,
    )

    webview.start()

if __name__ == "__main__":
    app()


