import {FaClock} from "react-icons/fa";
import TimelineUseReducer from "./TimelineUseReducer.jsx";


const SegmentsDownloader = function ({videoInfo}) {

    const {videoTitle="", streaming_url="", videoDuration="", durationSeconds=0} = videoInfo || {};

    return (
        <div className="w-full space-y-6 *:ring-2 *:ring-offset-4 *:ring-offset-neutral-900 *:ring-gray-700 *:rounded *:p-2">
            {/*video preview*/}
            <div className="flex items-start gap-4 relative">
                <video
                    src={streaming_url}
                    className={`aspect-video w-90 rounded bg-black`}
                    autoPlay={false} loop controls
                >
                </video>


                <div className="space-y-2">
                    <p className="p-2 bg-gray-800 rounded px-4">{videoTitle}</p>
                    <div className="w-fit text-sm flex gap-1 items-center px-3 rounded-full py-1 bg-gray-800"><FaClock className="fill-stone-500" size={18} /> {videoDuration}</div>
                </div>
            </div>

            <TimelineUseReducer videoDuration={durationSeconds} />
        </div>
    );
}

export default SegmentsDownloader;