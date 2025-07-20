from tkinter.filedialog import askdirectory
from backend.user.database import User, db
from backend.status import Status
from webview import windows
import webview

class SaveLocation:

    def get_user_save_loc(self):
        try:
            db.connect(reuse_if_open=True)
            user, created = User.get_or_create(id=1)
            specified_location = user.user_save_location
            location_specified = bool(specified_location)
            if not location_specified:
                # prompt the user to specify location
                print("Hi user has not specified the location")
                return {
                    "ok": True,
                    "specifiedLocation": specified_location,
                    "specified": False,
                    "status": Status.SUCCESS.value
                }
            else:
                return {
                    "specifiedLocation": specified_location,
                    "specified": location_specified,
                    "status": Status.SUCCESS.value
                }

        except Exception as err:
            print(err)
            return {
                "ok": False,
                "error": "Failed to fetch save location",
                "details": str(err),
                "status": Status.ERROR.value
            }


    def specify_location(self):
        try:
            # location = askdirectory()
            location = windows[0].create_file_dialog(webview.FOLDER_DIALOG, allow_multiple=False)
            print(f"PyWebView Location: {location[0]}" if location else "Location Not Specified")
            if location:
                folder = location[0]
                print(folder)
                self._save_location_to_db(specified_location=folder)
                return {
                    "status": Status.SUCCESS.value,
                    "specifiedLocation": folder,
                    "specified": True
                }
            else:
                location_specified = self.user_specified_loc()
                return {
                    "status": Status.CANCELLED.value,
                    "specified": False,
                    "specifiedLocation": None,
                    "error": "Change location not specified" if location_specified else "Specify Location"
                }
        except Exception as err:
            return {
                "status": Status.ERROR.value,
                "error": err
            }


    def _save_location_to_db(self, specified_location):
        with db:
            user = User.get(id=1)
            user.user_save_location = specified_location
            user.save()


    def user_specified_loc(self):
        '''
        returns if the user has specified location or not
        :return:
        '''
        with db:
            user = User.get(id=1)
            return bool(user.user_save_location)
