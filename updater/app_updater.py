import os
import sys
import requests
from webview import windows
from backend.status import Status
from backend.utils.utils import __VERSION__
from packaging import version
import subprocess

class AppUpdate:
    def __init__(self):
        self.repo = "nidhish17/ambientTube"
        self.url = f"https://api.github.com/repos/{self.repo}/releases/latest"

    def check_for_updates(self):
        try:
            current_version = __VERSION__
            # print(f"Current Version: {__VERSION__}")
            res = requests.get(self.url)
            latest_version = res.json().get("tag_name")
            # print(f"Latest Version: {latest_version}")
            update_available = False
            if version.parse(latest_version) > version.parse(current_version):
                update_available = True
            return {"details": {"currentVersion": __VERSION__, "latestVersion": latest_version, "updateAvailable": update_available}}
        except Exception as e:
            print(e)
            return {"status": Status.ERROR, "details": {"error": str(e)}, "ok": False}

    def update_application(self):
        print("Updating application, updating started!")
        if (getattr(sys, "frozen", False)):
            base_dir = os.path.dirname(sys.executable)
        else:
            base_dir = os.path.dirname(os.path.abspath(__file__))
        # print(str(os.getpid()))
        cmd = [
            os.path.join(base_dir, "updater.exe"),
            "--current-version", "1.0.0",
            "--parent-pid", str(os.getpid())
        ]
        subprocess.Popen(
            cmd,
            creationflags=subprocess.DETACHED_PROCESS
        )
        print("Closing application")
        windows[0].destroy()

# update = AppUpdate()
# update.check_for_updates()
# update.update_application()

### Update Naming Conventions ###
# They should NOT START WITH LETTER V like this -> v1.2.0; correct format -> 1.2.0
# github releases tag name should always be in the format 2.x(major fix).x(minor fixes)
# mostly it would be minor fixes if you update a package...
# feature updates would go into major place
# The first app would be with an installer rest all releases would be just exe that should only be used by updater.exe
# [! IMPORTANT]
#### Make sure to update the __version__ variable in utils.utils.py else the update feature will not work! ####


