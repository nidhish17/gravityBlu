from backend.status import Status
from backend.user.database import db, User


class DefaultSettings:

    def get_download_preferences(self):
        # query the database and send if askEveryTime is checked, and vcodec value and the video quality value
        try:
            with db:
                user = User.get(id=1)
                return {
                    "data": {
                        "askEveryTime": user.ask_quality_everytime,
                        "videoQuality": user.quality
                    },
                    "ok": True,
                    "status": Status.SUCCESS.value
                }

        except Exception as err:
            return {
                "ok": False,
                "status": Status.ERROR.value,
                "details": str(err),
                "error": "Failed to fetch preferences"
            }

    def update_ask_everytime(self, data):
        try:
            with db:
                user = User.get(id=1)
                user.ask_quality_everytime = data["askQualityEverytime"]
                # user.save()
                return {
                    "ok": True,
                    "status": Status.SUCCESS.value,
                    "data": {
                        "askQualityEverytime": user.ask_quality_everytime
                    }
                }
        except Exception as err:
            print(err)
            return {
                "ok": False,
                "status": Status.ERROR.value,
                "data": {
                    "error": "Failed to update",
                    "details": str(err),
                }
            }

    def update_settings(self, data):
        print(data)

        try:
            with db:
                user = User.get(id=1)
                specified_quality = data["defaultVideoQuality"]

                if specified_quality == "720p":
                    user.quality = 720
                elif specified_quality == "1080p":
                    user.quality = 1080
                elif specified_quality == "2k":
                    user.quality = 1440
                elif specified_quality == "4k":
                    user.quality = 2160
                elif specified_quality == "8k":
                    user.quality = 4320

                if specified_quality:
                    user.save()
                else:
                    return {
                        "ok": False,
                        "status": Status.ERROR.value,
                        "data": {
                            "error": "options not specified",
                            "details": "options not specified",
                        }
                    }

                return {
                    "ok": True,
                    "status": Status.SUCCESS.value,
                    "data": {
                        "videoQuality": user.quality
                    }
                }
        except Exception as err:
            print(err)
            return {
                "ok": False,
                "status": Status.ERROR.value,
                "data": {
                    "error": "Failed to update",
                    "details": str(err),
                }
            }


