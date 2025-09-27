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
                toast.error(videoInfo?.error || "something went wrong");
                console.log(videoInfo);
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
            console.log(newDownload);
            setDownloads(newDownload);
            setDownloadUrl("");
        } catch (err) {
            // console.log(err);
            toast.error("something went wrong.");
        } finally {
            setLoading(false)
        }

    }

    return (
        <div
            className={`border-2 flex flex-col justify-center h-full border-dashed rounded-xl border-gray-500/60 hover:border-violet-600 p-4`}>
            <div className="flex flex-col px-8 items-center gap-y-6">
                <RiVideoDownloadFill className="-rotate-6" size={100}/>
                <SearchBar disabled={loading} inputValue={downloadUrl} onSubmit={addDownload} inputType="url" onChange={(e) => setDownloadUrl(e.target.value)}>
                    <div className="relative">
                        <select disabled={loading} value={downloadType} onChange={(e) => setDownloadType(e.target.value)} className="text-sm appearance-none h-full rounded block pl-4 pr-8 bg-gray-700 text-neutral-100 outline-none disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default">
                            <option value="video">video</option>
                            <option value="audio">audio</option>
                        </select>
                        <span className="absolute block right-1 inset- top-1/2 -translate-y-1/2 pointer-events-none"><FaCaretDown size={18} /></span>
                    </div>
                </SearchBar>
                <h2 className="text-xl font-bold">Paste Your URL here to download high-quality video</h2>
            </div>
        </div>
    );
}

export default Download;