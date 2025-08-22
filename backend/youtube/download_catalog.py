from backend.user.database import get_downloads, Download
from peewee import fn

class DownloadCatalog:
    def get_downloaded(self, page: int = 1):
        downloaded_content = get_downloads(page=page)
        downloads = []
        print("called get_downloaded")
        for dl in downloaded_content:
            downloads.append({
                "downloadId": dl.id,
                "title": dl.title,
                "type": dl.type,
                "duration": dl.duration,
                "resolution": dl.resolution,
                "filesize": dl.size,
                "saveLocation": dl.save_loc,
                "thumbnail": dl.thumb_link
            })
        return downloads

    def get_downloads_metadata(self):
        total_downloads = Download.select().count()
        total_size = (Download.select(fn.COALESCE(fn.sum(Download.size), 0)).scalar()) or 0
        return {"totalDownloads": total_downloads, "totalSize": total_size}


# DownloadCatalog().get_downloads_metadata()
