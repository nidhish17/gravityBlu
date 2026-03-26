import SearchBar from "../SearchBar.jsx";
import useDownloadStore from "../../hooks/useDownloadStore.js";
import {useState} from "react";
import toast from "react-hot-toast";
import {IoIosWarning} from "react-icons/io";
import DownloadModeSelector from "../ui/DownloadModeSelector.jsx";
import VideoPreviewCard from "../ui/VideoPreviewCard.jsx";
import PreviewLoadingSkeleton from "../ui/PreviewLoadingSkeleton.jsx";
import PlaybackManager from "../ui/segment/PlaybackManager.jsx";
import {motion, AnimatePresence} from "framer-motion";

const Download = function () {
    // info loader
    const [loading, setLoading] = useState(false);
    const [addingDownload, setAddingDownload] = useState(false);


    const [downloadUrl, setDownloadUrl] = useState("");
    const [downloadType, setDownloadType] = useState("video");

    const [downloadMode, setDownloadMode] = useState("full");
    const [videoInfo, setVideoInfo] = useState(null);

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
            setAddingDownload(true);
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
            setAddingDownload(false)
        }

    }

    const generateDownloadPreview = async function (e) {
        if (downloadType === "audio") {
            await addDownload(e);
            return;
        }
        e.preventDefault();
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
            const videoInfo = await window.pywebview.api.yt_api.get_video_info(downloadUrl);
            console.log(videoInfo);
            setVideoInfo(videoInfo);
        } catch (err) {
            // console.log(err.message);
            toast.error(err.message || "Something went wrong", {duration: 5000});
        } finally {
            setLoading(false);
        }

    }

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-y-6">
                <SearchBar
                    disabled={loading || addingDownload}
                    inputValue={downloadUrl}
                    onSubmit={generateDownloadPreview}
                    inputType="url"
                    setDownloadUrl={setDownloadUrl}
                    downloadType={downloadType}
                    setDownloadType={setDownloadType}
                />
                <PreviewLoadingSkeleton/>
            </div>
        )
    }


    return (
        <div className="flex flex-col items-center gap-y-6">
            <SearchBar
                disabled={loading || addingDownload}
                inputValue={downloadUrl}
                onSubmit={generateDownloadPreview}
                inputType="url"
                setDownloadUrl={setDownloadUrl}
                downloadType={downloadType}
                setDownloadType={setDownloadType}
            />
            {videoInfo && (
                <>
                    <DownloadModeSelector downloadMode={downloadMode} setDownloadMode={setDownloadMode}/>
                    {/*add the logic here to change to segments and full video download*/}
                    <AnimatePresence mode="wait" initial={false}>
                        {downloadMode === "full" ? (
                            <motion.div
                                className="w-full"
                                key="full-video"
                                initial={{opacity: 0, x: -100, scale: 0.95}}
                                animate={{opacity: 1, x: 0, scale: 1, z:0.01}}
                                exit={{opacity: 0, x: -100, scale: 0.95}}
                                transition={{duration: 0.2}}
                            >
                                <VideoPreviewCard videoInfo={videoInfo} addDownload={addDownload}
                                                  disabled={addingDownload}/>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="w-full"
                                key="segments"
                                initial={{opacity: 0, x: 100, scale: 0.95}}
                                animate={{opacity: 1, x: 0, scale: 1}}
                                exit={{opacity: 0, x: 100, scale: 0.95}}
                                transition={{duration: 0.2}}
                            >
                                <PlaybackManager videoInfo={videoInfo} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}


        </div>
    );
}

/*<h1>For the timeline create a horizontal scrollbar like in premiere pro to show all the time of the video! in a spaced out manner</h1>*/

/*
    implement user onboarding
    allow users to select what loads by default full video download preview or segments
*/

export default Download;