import {RiFileVideoLine} from "react-icons/ri";
import {HiServer} from "react-icons/hi2";
import {SiTicktick} from "react-icons/si";
import {formatBytes} from "../../utils/utils.js";
import {MdOutlineFileDownload} from "react-icons/md";


const VideoPreviewCard = function ({videoInfo, addDownload, disabled}) {

    const {videoTitle="", videoDuration="", selectedFormat={filesize_approx: 0}, thumbnail=""} = videoInfo || {};

    if (!videoInfo) return null;

    return (
        <div className="ring ring-gray-700 bg-gray-800 w-full rounded flex flex-col items-center justify-center gap-y-6 p-4 py-12">
            <div className="size-20 rounded-full bg-gradient-to-br from-blue-600 to-pink-500 flex items-center justify-center">
                <RiFileVideoLine size={50} />
            </div>

            <h4 className="text-lg font-semibold">Ready to download Full Video</h4>
            {/*info card*/}
            <div className="ring-2 ring-gray-700 ring-offset-4 ring-offset-gray-800 rounded flex justify-between gap-4 w-3xl p-4 bg-gray-900">
                <div className="flex flex-col gap-y-4 basis-2/3 justify-center relative">
                    <img src={thumbnail} alt={videoTitle} className="h-40 w-auto rounded-md ring-2 ring-gray-700 ring-offset-3 ring-offset-gray-900" />
                    <div className="bg-black/60 absolute right-1 bottom-1 text-sm font-semibold p-1 px-2 rounded-lg text-white">{videoDuration}</div>
                </div>

                <div className="space-y-6 basis-full">
                    <div className="flex flex-row gap-x-2 items-start">
                        <p className="text-sm flex gap-x-1 items-center px-4 py-2 rounded ring bg-gray-800 ring-gray-700 text-gray-400">
                            <RiFileVideoLine className="fill-blue-600" size={18} /> Format: <span className="text-white text-xs">Video</span>
                        </p>

                        <p className="text-sm flex gap-x-1 items-center px-4 py-2 rounded ring bg-gray-800 ring-gray-700 text-gray-400">
                            <HiServer className="fill-purple-600" size={18} /> Size: <span className="text-white text-xs">{formatBytes(selectedFormat.filesize_approx || 0)}</span>
                        </p>

                        <p className="text-sm flex gap-x-1 items-center px-4 py-2 rounded ring bg-gray-800 ring-gray-700 text-gray-400">
                            <SiTicktick className="fill-green-600" size={18} /> Quality: <span className="text-white text-xs">Best</span>
                        </p>
                    </div>

                    <p className="p-2 bg-gray-800 rounded px-4">{videoTitle}</p>
                    {/*<p className="p-2 bg-gray-900 rounded px-4"></p>*/}
                </div>
            </div>

            <div className="max-w-3xl w-3xl flex justify-end">
                <button onClick={addDownload} disabled={disabled} className="bg-lime-600 hover:bg-lime-600/80 ring-2
                ring-offset-4 ring-offset-gray-800 ring-lime-500 hover:ring-offset-0 transition-all cursor-pointer
                duration-200 font-semibold px-4 py-2 rounded flex gap-x-1 items-center justify-center
                disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default
                disabled:ring-stone-500/80 disabled:transition-none">
                    <MdOutlineFileDownload size={25} />
                    Download Video
                </button>
            </div>

        </div>
    );
}

export default VideoPreviewCard;