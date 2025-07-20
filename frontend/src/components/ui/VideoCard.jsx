import {FaRegFolder, FaRegFolderOpen, FaYoutube} from "react-icons/fa";
import {RiDeleteBin2Line} from "react-icons/ri";
import {GoDeviceCameraVideo} from "react-icons/go";
import {MdOutlineVideoStable} from "react-icons/md";
import {CiClock2, CiSaveDown1} from "react-icons/ci";
import {useEffect, useState} from "react";
import {formatBytes} from "../../utils/utils.js";
import {IoMusicalNotesSharp} from "react-icons/io5";
import toast from "react-hot-toast";

const VideoCard = function ({
                                thumbImgLink,
                                downloaded,
                                videoTitle,
                                progress,
                                selectedQuality = "",
                                processing,
                                downloadType,
                                progressDetail,
                                downloadedDetail = {}
                            }) {

    const [loading, setLoading] = useState(false);

    const handleOpenFileLocation = async function (filepath, videoTitle = "") {
        const toastId = toast.loading(`Opening ${videoTitle.length > 25 ? videoTitle.slice(0, 25 - 3) + "..." : videoTitle}`, {duration: 1200});
        try {
            setLoading(true);
            const data = await window.pywebview.api.open_file_location(filepath);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong", {id: toastId});
            toast.dismiss(toastId);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className={`p-3 flex flex-row gap-x-4 bg-neutral-800/70 ${downloaded && "hover:bg-neutral-700/70"} rounded-lg group`}>
            {/*thumbnail container*/}
            <div className="basis-1/5 aspect-[16/9] relative">
                <img src={thumbImgLink} alt="thumb-img" className="rounded object-center object-cover h-full w-full"/>
                {downloadType === "audio" && (
                    <div
                        className="absolute rounded inset-0 bg-neutral-900/50 flex items-center justify-center text-neutral-100/80">
                        <IoMusicalNotesSharp size={50}/>
                    </div>
                )}

                {/*<div*/}
                {/*   className="absolute inset-0 flex items-center justify-center transition-all duration-200*/}
                {/*   opacity-0 hover:opacity-100 origin-top backdrop-blur-sm rounded bg-gray-900/70 hover:ring-1*/}
                {/*   ring-purple-900">*/}
                {/*    <a href={imgLink} target="_blank" className="font-bold"><CiSaveDown1 size={30} /></a>*/}
                {/*</div>*/}
            </div>

            {/*information container*/}
            <div className="basis-full flex flex-col gap-y-12 justify-between">
                {/*video title and delete card btn*/}
                <div className="flex flex-col gap-y-1">
                    <div className="flex justify-between items-center ">
                        <h4 className="font-semibold flex gap-x-3 items-center">
                            <span className=""><FaYoutube className="text-red-500" size={20}/></span>
                            {videoTitle}
                        </h4>
                        {downloaded && (
                            <button
                                className="cursor-pointer self-start opacity-0 group-hover:opacity-100 hover:bg-red-500/20 p-1 rounded">
                                <RiDeleteBin2Line className="text-red-600" size={20}/>
                            </button>
                        )}

                    </div>

                    {!downloaded && (
                        /*selected quality by yt-dlp*/
                        <p className="rounded self-start text-[0.62rem] bg-neutral-700 font-semibold py-0.5 px-2">
                            {downloadType === "audio" ? "MP3" : selectedQuality}
                        </p>
                    )}
                </div>

                {/*video info like resolution, filesize, duration*/}
                <div className="flex flex-col gap-y-3">
                    {downloaded && (
                        <div className="flex items-center justify-between">

                            <div className="flex gap-x-8 font-thin text-sm">
                                <p className="flex gap-x-3 items-center">
                                    <span>
                                    {downloadType === "video" ? <GoDeviceCameraVideo size={20}/> :
                                        downloadType === "audio" && <IoMusicalNotesSharp/>}
                                    </span>
                                    {downloadType === "video" ? "MP4" : downloadType === "audio" && "MP3"}
                                </p>
                                <p className="flex gap-x-3 items-center"><span><MdOutlineVideoStable size={20}/></span>
                                    {downloadedDetail.resolution}
                                </p>
                                <p className="flex gap-x-3 items-center"><span><FaRegFolder size={20}/></span>
                                    {formatBytes(downloadedDetail.filesize)}
                                </p>
                                <p className="flex gap-x-3 items-center"><span><CiClock2
                                    size={20}/></span>{downloadedDetail.duration}</p>
                            </div>


                            {/*open file location*/}
                            <button
                                onClick={() => handleOpenFileLocation(`${downloadedDetail.saveLocation}.${downloadType === "video" ? "mp4" : downloadType === "audio" && "mp3"}`, videoTitle)}
                                data-tooltip-id="tip" data-tooltip-content="Open File Location"
                                className="hover:bg-neutral-800 cursor-pointer p-1 rounded disabled:animate-pulse disabled:cursor-not-allowed disabled:bg-neutral-900/80"
                                disabled={loading}><FaRegFolderOpen
                                size={25}/>
                            </button>
                        </div>
                    )}

                    {!downloaded && (
                        <div className="progress-info gap-y-1 flex flex-col">
                            <div className="flex justify-center">
                                <div className="relative rounded-full h-2 basis-full bg-stone-700/50">
                                    <div style={{width: progress} || "0%"}
                                         className={`absolute rounded-full bg-indigo-600/90 inset-0`}></div>
                                </div>
                            </div>

                            <div
                                className="flex flex-row justify-between tracking-tighter text-xs text-indigo-600 font-bold">
                                {
                                    processing ? (
                                        <p className="tracking-wide">⚡ <span
                                            className="animate-pulse">Processing...</span></p>
                                    ) : (
                                        <>
                                            <p className="">{progressDetail.downloadedBytes && `⚡ ${formatBytes(progressDetail.downloadedBytes)} / ${formatBytes(progressDetail.totalBytes)}, remains ${progressDetail.eta}`}</p>
                                            <p className="">{progressDetail.speed}</p>
                                        </>
                                    )
                                }

                            </div>
                        </div>
                    )}

                </div>


            </div>
        </div>
    );
}

export default VideoCard;