import VideoCard from "../ui/VideoCard.jsx";
import usePywebview from "../../hooks/usePywebview.js";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import download from "./Download.jsx";
import {formatBytes} from "../../utils/utils.js";

const Downloaded = function ({videosDownloading}) {

    const [loading, setLoading] = useState(false);
    const [downloadedContent, setDownloadedContent] = useState([]);
    const [downloadsMetadata, setDownloadsMetadata] = useState({});

    // const totalDownloads = downloadedContent.length;
    // const totalFileSize = downloadedContent.reduce((acc, cur) => {
    //     return acc + cur.filesize;
    // }, 0);

    const {totalDownloads, totalSize: totalFileSize} = downloadsMetadata;

    useEffect(() => {
        // here not using the usePyWebview Hook because for some reason it was not calling the function and ig it is
        // only when u want to call on load or app start later u don't need it because window.pywebview.api is mounted
        async function fetchDownloaded() {
            try {
                setLoading(true);
                const downloadedVideos = await window.pywebview.api.catalog.get_downloaded(1);
                const downloadsMetadata = await window.pywebview.api.catalog.get_downloads_metadata();
                // console.log(data, "data");
                setDownloadsMetadata(downloadsMetadata);
                setDownloadedContent(downloadedVideos);
            } catch (err) {
                console.log(err);
                toast.error("something went wrong");
            } finally {
                setLoading(false)
            }
        }

        fetchDownloaded();
    }, [videosDownloading]);

    const handleDeleteDownload = async function (id) {
        console.log(id);
        try {
            setLoading(true);
            const data = await window.pywebview.api.delete_download(id);
            setDownloadedContent((downloads) => {
                return downloads.filter((download) => (download.downloadId !== id));
            });
            const updatedMetadata = await window.pywebview.api.catalog.get_downloads_metadata();
            setDownloadsMetadata(updatedMetadata);
            console.log(data);
            toast.success(`successfully deleted. Deleting a card doesn't delete the video`, {duration: 4000})
        } catch (err) {
            toast.error("couldn't delete the download.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`flex flex-col justify-between grow`}>
            <div className="flex flex-col gap-y-4 grow">
                <hr className="text-gray-500/60"/>
                <div className="relative grow">
                    <div className="absolute h-full w-full overflow-y-scroll flex flex-col gap-y-4 pb-4 no-scrollbar">
                        {loading ?
                            <p className="text-3xl font-semibold text-center animate-pulse">Loading...</p>
                            :
                            downloadedContent.map((dl, i) => {
                                const {title, duration, thumbnail, resolution, type, filesize, saveLocation, downloadId} = dl;
                                return <VideoCard key={downloadId} downloaded thumbImgLink={thumbnail} downloadType={type} videoTitle={title}
                                                  downloadedDetail={{duration, resolution, filesize, saveLocation}} downloadId={downloadId} handleDeleteDownload={handleDeleteDownload} />
                            })}
                    </div>
                </div>
            </div>

            {/*footer contains total size of the downloaded content*/}
            <div
                className="border-t border-t-gray-600 py-4 rounded-b-lg text-center flex items-center justify-center bg-neutral-950">
                <p className="font-thin">{totalDownloads} Item(s), {formatBytes(totalFileSize)}</p>
                {/*<p className="font-thin">{totalDownloads} Item(s), {totalFileSize}</p>*/}
            </div>
        </div>
    );
}

export default Downloaded;