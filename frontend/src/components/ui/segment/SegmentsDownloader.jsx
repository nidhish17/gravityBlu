import {MdOutlineFileDownload} from "react-icons/md";
import {useState} from "react";
import toast from "react-hot-toast";
import useSegmentDownloadStore from "../../../../store/useSegmentDownloadStore.js";

const SegmentsDownloader = function ({segments, clearSegments, videoUrl}) {
    const addDownload = useSegmentDownloadStore((state) => state.addDownload);

    const [loading, setLoading] = useState(false);

    const downloadSegments = async function () {
        try {
            setLoading(true);
            const {status_code: statusCode, message, ok, videoInformation: vidInfo} = await window.pywebview.api.yt_api.download_segments({"url": videoUrl, "segments": segments});
            console.log(vidInfo, "videoInformation!");
            const {videoTitle, videoId, videoDuration, thumbnail: videoThumb, durationSeconds} = vidInfo;
            console.log("Adding video id", videoId, "to segment download store");
            addDownload({
                id: videoId,
                videoTitle,
                videoDuration,
                videoThumb,
                durationSeconds,
                downloaded: false,
                progress: "0%",
                processing: true,
                downloadType: "segment",
                numSegments: segments.length
            })

            // if (statusCode === 200) {
            //     toast.success("Successfully Downloaded", {position: "top-center", duration: 3500});
            //     clearSegments();
            // }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }


    if (!segments.length) return <p className="font-semibold text-lg">Start creating some segments!</p>

    return (
        <div className="flex justify-between items-center">
            <button onClick={downloadSegments} disabled={loading} className="bg-lime-600 hover:bg-lime-600/80 ring-2 self-start
                ring-offset-4 ring-offset-gray-800 ring-lime-500 hover:ring-offset-0 transition-all cursor-pointer
                duration-200 font-semibold px-4 py-2 rounded flex gap-x-1 items-center justify-center
                disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default
                disabled:ring-stone-500/80 disabled:transition-none">
                <MdOutlineFileDownload size={25}/>
                Download {segments.length} Segment{segments.length > 1 ? "s" : ""}
            </button>

            <button
                onClick={clearSegments}
                className="px-4 py-3 rounded-md hover:bg-white/80 text-black transition-all duration-200 bg-white
                         cursor-pointer font-semibold ring-offset-4 ring-offset-neutral-900 ring-white hover:ring-offset-0">
                Clear Segments
            </button>
        </div>

    );
}

export default SegmentsDownloader;