import {HiOutlineTrash} from "react-icons/hi2";
import {formatSecondsToHHMMSS} from "../../../utils/utils.js";
import SegmentEditForm from "./SegmentEditForm.jsx";
import ProgressInput from "./ProgressInput.jsx";

const SegmentControls = function ({segments, deleteSegment, selectedSegmentId, setSelectedSegmentId, editSegment, seekTo}) {

    return (
        <div className={`flex flex-col gap-6`}>
            <SegmentEditForm segments={segments} selectedSegmentId={selectedSegmentId} editSegment={editSegment} deleteSegment={deleteSegment} />

            {/**/}
            {segments && (
                <div className="flex flex-wrap gap-5 items-center">
                    {segments.map((segment) => <SegmentInfoBox
                        key={segment.id}
                        segment={segment}
                        deleteSegment={deleteSegment}
                        selectedSegmentId={selectedSegmentId}
                        setSelectedSegmentId={setSelectedSegmentId}
                        seekTo={seekTo}
                    />)}
                </div>
            )}



        </div>
    )
}


const SegmentInfoBox = function ({segment, deleteSegment, setSelectedSegmentId, selectedSegmentId, seekTo}) {
    const {id, name, startTime, endTime, segmentColor} = segment;

    const startTimeFormatted = formatSecondsToHHMMSS(startTime);
    const endTimeFormatted = formatSecondsToHHMMSS(endTime);
    const duration = formatSecondsToHHMMSS(Math.abs(endTime - startTime));

    const handleClick = function (e) {
        setSelectedSegmentId(id);
        seekTo(segment.startTime);
    }

    return (
        <div onClick={handleClick} className={`w-80 rounded-xl border border-slate-700 bg-[#111827] 
        p-4 text-sm text-slate-300 shadow-lg ${selectedSegmentId === id ? "ring-2 ring-blue-500" : "hover:ring-gray-600 hover:ring-2"} hover:-translate-y-2 
        transition-all duration-200 `}>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-medium text-white">
                    <span style={{backgroundColor: segmentColor}} className="h-3 w-3 rounded-full"/>
                    {name}
                </div>
                <div className="flex gap-3">
                    <button className="" onClick={(e) => {
                        deleteSegment(id);
                        e.stopPropagation();
                    }}>
                        <HiOutlineTrash className="h-4 w-4 cursor-pointer text-red-400 hover:text-red-300" />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Start</span>
                    <span className="font-mono font-semibold text-white">{startTimeFormatted}</span>
                </div>
                <div className="flex justify-between">
                    <span>End</span>
                    <span className="font-mono font-semibold text-white">{endTimeFormatted}</span>
                </div>
            </div>

            <div className="mt-3 border-t border-slate-700 pt-3">
                <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-mono font-semibold text-blue-400">{duration}</span>
                </div>
            </div>
        </div>
    )
}

export default SegmentControls;