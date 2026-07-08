import {FaRegFolder, FaYoutube} from "react-icons/fa";
import {IoFolderOpen} from "react-icons/io5";
import {MdOutlineVideoStable} from "react-icons/md";
import {CiClock2} from "react-icons/ci";
import {HiFilm} from "react-icons/hi";
import {RiDeleteBin2Line} from "react-icons/ri";
import {useState} from "react";
import useSegmentDownloadStore from "../../../../store/useSegmentDownloadStore.js";

const DownloadCard = function ({downloadInfo}) {

    const {id, downloaded, videoTitle, videoThumb, numSegments} = downloadInfo || {};
    const [isPaused, setIsPaused] = useState(false);
    const removeSegmentDownload = useSegmentDownloadStore((state) => state.removeDownload);

    const handleDeleteDownload = function (id) {
        // console.log("Deleting download with id", id);
    }

    const handlePause = async () => {
        setIsPaused(true);
        await window.pywebview.api.pause_download(id);
    };

    const handleResume = async () => {
        setIsPaused(false);
        await window.pywebview.api.resume_download(id);
    };

    const handleCancel = async () => {
        try {
            await window.pywebview.api.cancel_download(id);
            removeSegmentDownload(id);
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <div className="animated-gradient-border rounded-lg p-[2px]">
            <div className="flex gap-x-4 p-3 rounded-lg bg-neutral-950 hover:bg-neutral-950/85 group">
                {/*image thumbnail*/}
                <div className="basis-1/4 relative">
                    <img src={videoThumb} alt="thumb-img" className="rounded object-center object-cover h-full w-full"/>
                </div>

                {/*other details*/}
                <div className="flex flex-col justify-between basis-full">
                    <h4 className="font-semibold flex flex-col">
                        <div className="flex gap-x-3 items-center justify-between">
                            <span className="flex items-center gap-x-3">
                                <span className=""><FaYoutube className="text-red-500" size={20}/></span>
                                <p>{videoTitle}</p>
                            </span>

                            {downloaded && (
                                <button
                                    onClick={() => handleDeleteDownload(id)}
                                    // disabled={loading}
                                    className="cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-red-500/20 p-1 rounded">
                                    <RiDeleteBin2Line className="text-red-600" size={20}/>
                                </button>
                            )}
                        </div>
                        <p className="text-xs opacity-80 text-stone-400 font-normal">Downloading {numSegments} segment{numSegments > 1 ? "s" : ""}.</p>
                    </h4>

                    {downloaded && <DownloadComplete/>}

                    {!downloaded && (
                        <div className="flex flex-col">
                            <ProgressIndicator />
                            <div className="flex justify-end gap-x-2 mt-1">
                                {isPaused ? (
                                    <button onClick={handleResume} className="bg-green-600/90 hover:bg-green-500/90 px-3 py-1 text-xs text-white rounded cursor-pointer transition-colors">Resume</button>
                                ) : (
                                    <button onClick={handlePause} className="bg-yellow-600/90 hover:bg-yellow-500/90 px-3 py-1 text-xs text-white rounded cursor-pointer transition-colors">Pause</button>
                                )}
                                <button onClick={handleCancel} className="bg-red-600/90 hover:bg-red-500/90 px-3 py-1 text-xs text-white rounded cursor-pointer transition-colors">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}


const OpenFileLocationButton = function () {
    return (
        <button
            // onClick={() => handleOpenFileLocation(`${downloadedDetail.saveLocation}`, videoTitle)}
            data-tooltip-id="tip" data-tooltip-content="Open File Location"
            className="cursor-pointer p-2 rounded-full disabled:animate-pulse
             disabled:cursor-not-allowed disabled:bg-neutral-900/80 transition-colors duration-200">
            <IoFolderOpen size={25} className="fill-white hover:fill-amber-200/80 transition-all duration-200"/>
        </button>
    )
}


const DownloadComplete = function () {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-x-8 font-thin text-sm items-center justify-center">
                <p className="flex gap-x-3 items-center">
                        <span className="flex items-center">
                            <HiFilm  size={20}/>
                        </span>
                    segments
                </p>
                <p className="flex gap-x-3 items-center"><span><MdOutlineVideoStable size={20}/></span></p>
                <p className="flex gap-x-3 items-center"><span><FaRegFolder size={20}/></span>
                    {/*{formatBytes(downloadedDetail.filesize)}*/}
                    104MB
                </p>
                <p className="flex gap-x-3 items-center">
                    <span><CiClock2 size={20}/></span>{"3:01"}
                </p>
            </div>

            <OpenFileLocationButton/>
        </div>
    )
}

const ProgressIndicator = function ({processing}) {
    return (
        <p className="tracking-wide">
            ⚡
            <span className="animate-pulse">
                {processing ? "Processing..." : "Downloading..."}
            </span>
        </p>
    )
}


export default DownloadCard;