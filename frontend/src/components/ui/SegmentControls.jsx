import {HiOutlinePencil, HiOutlineTrash} from "react-icons/hi2";
import {formatSecondsToHHMMSS} from "../../utils/utils.js";
import SegmentEditForm from "./SegmentEditForm.jsx";

const SegmentControls = function ({clearSegments, segments, deleteSegment, selectedSegmentId, setSelectedSegmentId, editSegment}) {

    return (
        <div className={`borde space-y-6`}>

            <SegmentEditForm segments={segments} selectedSegmentId={selectedSegmentId} editSegment={editSegment} deleteSegment={deleteSegment} />

            <div className="flex justify-between items-center gap-4">
                <div className="ring-1 ring-gray-700 flex items-center justify-center p-1 rounded-md basis-full gap-3 focus-within:ring-gray-500 transition-colors duration-200">
                    <input type="text" className="px-4 py-2 rounded outline-none font-semibold w-full"
                           placeholder="HH:MM:SS"/>
                    <button className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors cursor-pointer">
                        Jump
                    </button>
                </div>

                <button
                    onClick={clearSegments}
                    className="px-4 py-3 rounded-md hover:bg-white/80 text-black transition-all duration-200 bg-white
                     cursor-pointer font-semibold basis-1/6 ring-offset-4 ring-offset-neutral-900 ring-white hover:ring-offset-0">
                    Clear Segments
                </button>
            </div>


            <div className={`flex flex-wrap gap-5 justify-between *:grow`}>
                {segments.map((segment) => <SegmentInfoBox
                    key={segment.id}
                    segment={segment}
                    deleteSegment={deleteSegment}
                    selectedSegmentId={selectedSegmentId}
                    setSelectedSegmentId={setSelectedSegmentId}
                />)}
            </div>


        </div>
    )
}


const SegmentInfoBox = function ({segment, deleteSegment, setSelectedSegmentId, selectedSegmentId}) {
    const {id, name, startTime, endTime, segmentColor} = segment;

    const startTimeFormatted = formatSecondsToHHMMSS(startTime);
    const endTimeFormatted = formatSecondsToHHMMSS(endTime);
    const duration = formatSecondsToHHMMSS(Math.abs(endTime - startTime));

    return (
        <div onClick={() => setSelectedSegmentId(id)} className={`w-80 rounded-xl border border-slate-700 bg-[#111827] p-4 text-sm text-slate-300 shadow-lg ${selectedSegmentId === id && "ring-2 ring-blue-500"}`}>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-medium text-white">
                    <span style={{backgroundColor: segmentColor}} className="h-3 w-3 rounded-full"/>
                    {name}
                </div>
                <div className="flex gap-3">
                    <button className="" onClick={() => deleteSegment(id)}>
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