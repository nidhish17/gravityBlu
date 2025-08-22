import requests
from backend.status import Status
from backend.utils.utils import __VERSION__
from packaging import version
import webbrowser


class AppUpdate:
    def __init__(self):
        self.repo = "nidhish17/gravityBlu"
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
            return {"details": {"currentVersion": __VERSION__, "latestVersion": latest_version,
                                "updateAvailable": update_available}}
        except Exception as e:
            # print(e, "from app_updater")
            return {"status": Status.ERROR.value, "details": {"error": str(e)}, "ok": False}

    def open_update_website(self):
        try:
            webbrowser.open("https://gravityblu.netlify.app/download")
            return {
                "status": Status.SUCCESS.value,
                "details": {
                    "message": "opened update website successfully",
                },
                "ok": True
            }
        except Exception as err:
            return {
                "status": Status.ERROR.value,
                "details": {
                    "message": "something went wrong",
                    "error": str(err),
                    "ok": False
                }
            }

# update = AppUpdate()
# update.check_for_updates()


### Update Naming Conventions ###
# They should NOT START WITH LETTER V like this -> v1.2.0; correct format -> 1.2.0
# github releases tag name should always be in the format 2.x(major fix).x(minor fixes)
# mostly it would be minor fixes if you update a package...
# feature updates would go into major place
# The first app would be with an installer rest all releases would be just exe that should only be used by updater.exe
# [! IMPORTANT]
#### Make sure to update the __version__ variable in utils.utils.py else the update feature will not work! ####
