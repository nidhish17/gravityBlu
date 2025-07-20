import argparse
import os.path
import sys
import threading
import requests
import tempfile
import shutil
from updater.updater_ui import UpdaterUi
import time
import errno

# APP_NAME = "GravityBlu.exe"
test_app_name = "ambientTube.msi"
APP_NAME = test_app_name

GITHUB_REPO = "nidhish17/ambientTube"
GITHUB_LATEST_RELEASE_URL = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"



def parse_cli():
    print("parsing cli")
    parser = argparse.ArgumentParser()
    parser.add_argument("--current-version", required=True)
    parser.add_argument("--parent-pid", required=True, type=int)
    print("done parsing cli")
    return parser.parse_args()


class AppUpdater:
    def __init__(self):
        pass

    def get_latest_version(self):
        print("getting latest version")
        res = requests.get(GITHUB_LATEST_RELEASE_URL, timeout=30)
        latest_version = res.json().get("tag_name")
        print("the latest version we got: ", latest_version)
        return latest_version

    def start_update(self, args, progress_var, update_ui):
        print("starting update")
        current_version = args.current_version
        try:
            latest_version = self.get_latest_version()
            if latest_version == current_version:
                return

            def progress_cb(pct):
                def update():
                    progress_var.set(pct / 100.0)
                    update_ui.progress_percent.configure(text=f"{int(pct)}%")
                update_ui.after(100, update)

            exe_path = self.download_exe(latest_version, progress_cb)

            # Relying on pywebview seeming that the app/window is closed/destroyed before replacing
            self.replace_app(exe_path)

        except Exception as e:
            print("Update Failed\n", e)
        finally:
            print("Done updating")
            # launch your updated application!


    def download_exe(self, latest_tag, progress_cb):
        print("Downloading exe")
        # this is the app name u set when u used pyinstaller to freeze and it should also match the github's release ver too
        asset_name = APP_NAME
        asset_url = f"https://github.com/{GITHUB_REPO}/releases/download/{latest_tag}/{asset_name}"

        temp_path = os.path.join(tempfile.gettempdir(), asset_name)

        with requests.get(asset_url, stream=True, timeout=30) as req:
            req.raise_for_status()
            total = int(req.headers.get("Content-Length", 0))
            downloaded = 0
            # write the updated app to the temp location. looks like -> C:Users/admin/AppData/Local/Temp/GravityBlu.exe
            # it'll write to GravityBlu.exe as that is the name provided in the open()
            with open(temp_path, "wb") as file:
                for chunk in req.iter_content(8192):
                    file.write(chunk)
                    downloaded += len(chunk)
                    # progress callback here
                    progress_cb(downloaded / total*100)

        return temp_path

    def replace_app(self, downloaded_path):
        install_dir = os.path.dirname(sys.executable)
        target = os.path.join(install_dir, APP_NAME)
        # overwrite the app
        shutil.move(downloaded_path, target)

def main():
    cli_args = parse_cli()
    update_ui = UpdaterUi()

    updater = AppUpdater()
    t = threading.Thread(target=updater.start_update, args=(cli_args, update_ui.progress_var, update_ui), daemon=True)
    t.start()

    update_ui.mainloop()

if __name__ == "__main__":
    main()


# updater = AppUpdater()
# lv = updater.get_latest_version
# print(os.path.join(tempfile.gettempdir(), "GravityBlu.exe"))


# pyinstaller --onefile --name=updater --icon="updater/updater.ico" updater/gravity_blu_updater.py
