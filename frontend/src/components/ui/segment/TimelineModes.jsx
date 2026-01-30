import {BsCursorFill} from "react-icons/bs";
import {FiEdit3} from "react-icons/fi";
import {RxCardStackPlus} from "react-icons/rx";
import {MODE_NAMES} from "./constants.js";

const {select, edit, create} = MODE_NAMES;

const TimelineModes = function ({currentMode, setMode}) {
    return (
        <div className="flex w-1/8 items-center justify-between gap-x-4 bg-sky-300/10">
            <ModeButton tipContent="Select Mode" selectedMode={currentMode === select} onClick={() => setMode(select)}>
                <BsCursorFill size={18} className="scale-x-[-1] fill-neutral-300" />
            </ModeButton>

            <ModeButton tipContent="Create Mode" selectedMode={currentMode === create} onClick={() => setMode(create)}>
                <RxCardStackPlus size={18} />
            </ModeButton>

            <ModeButton tipContent="Edit Mode" selectedMode={currentMode === edit} onClick={() => setMode(edit)}>
                <FiEdit3 size={18} className="fill-neutral-300" />
            </ModeButton>
        </div>
    );
}

const ModeButton = function ({children, tipContent, selectedMode, onClick}) {

    const modeSelectedStyles = "ring-2 ring-blue-500";

    return (
        <button
            onClick={onClick}
            data-tooltip-id="tip" data-tooltip-content={tipContent}
            className={`p-2 rounded-md bg-stone-700 hover:bg-stone-700/80 transition-all duration-200 cursor-pointer ${selectedMode && modeSelectedStyles}`}
        >
            {children}
        </button>
    )
}


export default TimelineModes;