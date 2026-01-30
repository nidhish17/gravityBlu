import {FaClock} from "react-icons/fa";
import TimelineUseReducer from "./TimelineUseReducer.jsx";
import {useRef} from "react";


const SegmentsDownloader = function ({videoInfo}) {

    const {videoTitle="", streaming_url="", videoDuration="", durationSeconds=0} = videoInfo || {};

    const videoRef = useRef(null);
    const playHeadRef = useRef(null);

    const handleTimeUpdate = function () {
        const video = videoRef.current;
        const line = playHeadRef.current;
        if (!line || !video) return;

        const x = video.currentTime * 10
        line.points([x, 0, x, 80]);
        line.getLayer().batchDraw();
    }

    return (
        <div className="w-full space-y-6 *:ring-2 *:ring-offset-4 *:ring-offset-neutral-900 *:ring-gray-700 *:rounded *:p-2">
            {/*video preview*/}
            <div className="flex items-start gap-4 relative">
                <video
                    src={streaming_url} ref={videoRef}
                    className={`aspect-video w-90 rounded bg-black`}
                    autoPlay={false} loop controls
                    onTimeUpdate={handleTimeUpdate}
                >
                </video>


                <div className="space-y-2">
                    <p className="p-2 bg-gray-800 rounded px-4">{videoTitle}</p>
                    <div className="w-fit text-sm flex gap-1 items-center px-3 rounded-full py-1 bg-gray-800"><FaClock className="fill-stone-500" size={18} /> {videoDuration}</div>
                </div>
            </div>

            <TimelineUseReducer videoDuration={durationSeconds} playHeadRef={playHeadRef} />
        </div>
    );
}

export default SegmentsDownloader;