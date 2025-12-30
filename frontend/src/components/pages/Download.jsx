import {RiVideoDownloadFill} from "react-icons/ri";
import SearchBar from "../SearchBar.jsx";
import useDownloadStore from "../../hooks/useDownloadStore.js";
import {useState} from "react";
import toast from "react-hot-toast";
import {IoIosWarning} from "react-icons/io";
import {FaCaretDown} from "react-icons/fa";

const Download = function ({loading, setLoading}) {
    const [downloadUrl, setDownloadUrl] = useState("");
    const [downloadType, setDownloadType] = useState("video");

    const setDownloads = useDownloadStore((state) => state.setDownloads);

    const addDownload = async function (e) {
        e.preventDefault();
        // console.log(downloadUrl);
        if (!downloadUrl || (!downloadUrl.includes("youtube.com/watch") && !downloadUrl.includes("youtu.be/") && !downloadUrl.includes("youtube.com"))) {
            toast("please enter a valid youtube url", {
                duration: 3000,
                icon: <IoIosWarning className="text-yellow-400" size={25}/>
            });
            setDownloadUrl("");
            return;
        }

        try {
            setLoading(true);
            // change the call here! if audio selected then call the audio downloader instead of video
            let videoInfo;
            if (downloadType === "video") {
                videoInfo = await window.pywebview.api.yt_api.download_yt_video(downloadUrl);
            } else if (downloadType === "audio") {
                videoInfo = await window.pywebview.api.yt_api.download_yt_audio(downloadUrl);
            }
            if (!videoInfo.ok) {
                // don't trigger toast here as the backend triggers the error
                // toast.error(videoInfo?.details || "something went wrong");
                // console.log(videoInfo, "video info");
                return;
            }
            const {videoInformation} = videoInfo.data;
            // console.log(videoInformation);
            const {videoTitle, videoId, videoDuration, selectedFormat, thumbnail: videoThumb} = videoInformation;
            const newDownload = {
                downloaded: false,
                id: videoId,
                videoTitle: videoTitle,
                videoDuration: videoDuration,
                videoThumbImg: videoThumb,
                videoHeight: selectedFormat.height,
                progress: "0%",
                processing: false,
                downloadType: downloadType
            }
            console.log("New Download: ", newDownload);
            setDownloads(newDownload);
            setDownloadUrl("");
        } catch (err) {
            // console.log(err.toString());
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="flex flex-col items-center gap-y-6">
            <SearchBar
                disabled={loading}
                inputValue={downloadUrl}
                onSubmit={addDownload}
                inputType="url"
                setDownloadUrl={setDownloadUrl}
                downloadType={downloadType}
                setDownloadType={setDownloadType}
            />
        </div>
    );
}

/*<h1>For the timeline create a horizontal scrollbar like in premiere pro to show all the time of the video! in a spaced out manner</h1>*/

export default Download;