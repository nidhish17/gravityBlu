import {HiCheck, HiOutlinePencil, HiOutlineTrash} from "react-icons/hi2";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {formatSecondsToHHMMSS} from "../../utils/utils.js";
import {FaArrowsLeftRight} from "react-icons/fa6";

const SegmentEditForm = function ({segments, selectedSegmentId, editSegment, deleteSegment}) {

    const selectedSegment = segments.find((seg) => seg.id === selectedSegmentId);
    const {id, name, startTime, endTime} = selectedSegment || {};
    const [selectedSegmentName, setSelectedSegmentName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setSelectedSegmentName(selectedSegment?.name || "");
        setIsEditing(false);
    }, [selectedSegmentId]);

    const handleEditSegment = function (e) {
        e.preventDefault();
        console.log("submitting form!");
        setIsEditing(false);
        editSegment({segId: selectedSegment.id, name: selectedSegmentName});
        toast.success("Edited successfully!", {position: "top-center"});
    }

    if (!selectedSegment) return null;

    return (
        <div className="bg-neutral-800 rounded ">
            <form onSubmit={handleEditSegment} className="flex items-center justify-center gap-x-2">
                <input
                    value={selectedSegmentName}
                    onChange={(e) => setSelectedSegmentName(e.target.value)}
                    disabled={!isEditing}
                    className={`rounded w-full p-2 px-4 outline-none disabled:cursor-not-allowed disabled:text-neutral-400 ${isEditing && "ring ring-neutral-400"}`}
                    maxLength={50}
                />

                <div className="text-neutral-400 text-xs flex gap-x-1 items-center">
                    <p className="p-1 rounded bg-neutral-700">{formatSecondsToHHMMSS(startTime)}</p>
                    <FaArrowsLeftRight size={18} />
                    <p className="p-1 rounded bg-neutral-700">{formatSecondsToHHMMSS(endTime)}</p>
                </div>

                <div className="flex gap-3 *:p-2 *:bg-neutral-700 *:rounded-md mx-2">

                    {isEditing ? (
                        // submit button
                        <button type="submit">
                            <HiCheck className={"h-4 w-4 cursor-pointer text-green-400 hover:text-green-300"}/>
                        </button>
                    ) : (
                        // sets isEditing state to true and prevents default behaviour. (const [isEditing, setIsEditing] = useState(false);)
                        // <button className="" type="button" onClick={setIsEditing(true)} -> earlier ver where form was submitting instead of changing state!
                        <button className="" type="button" onClick={function (e) {e.preventDefault();setIsEditing(true);}}>
                            <HiOutlinePencil className="h-4 w-4 cursor-pointer text-blue-400 hover:text-blue-300"/>
                        </button>
                    )}
                    {/* Delete Button */}
                    <button className="" type="button" onClick={() => deleteSegment(selectedSegment.id)}>
                        <HiOutlineTrash className="h-4 w-4 cursor-pointer text-red-400 hover:text-red-300"/>
                    </button>
                </div>

            </form>

        </div>
    )
}

export default SegmentEditForm;