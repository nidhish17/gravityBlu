import {Rect} from "react-konva";
import {useRef} from "react";
import {MODE_NAMES} from "./constants.js";

const EDGE_THRESHOLD = 8;
const {select, create, edit} = MODE_NAMES;

const SegmentRect = function ({segment, selectedSegmentId, setSelectedSegmentId, pxPerSec, currentMode, timelineLayerRef}) {
    const {id, startTime, endTime, segmentColor} = segment;
    // startWorldX, endWorldX
    const startWX = startTime * pxPerSec;
    const endWX = endTime * pxPerSec
    const width = endWX - startWX;

    const segmentRectRef = useRef(null);
    const pointerDown = useRef(null);

    const handleMouseMove = function (e) {
        const stage = e.target.getStage();
        const layer = e.target.getLayer();
        if (!stage || !segmentRectRef.current || !layer) return;

        const pos = layer.getRelativePointerPosition();
        const {x: pointerX} = pos;
        const rect = segmentRectRef.current;
        const rectX = rect.x();
        const rectWidth = rect.width();

        const isLeftEdge = pointerX < rectX + EDGE_THRESHOLD;
        const isRightEdge = pointerX > rectX + rectWidth - EDGE_THRESHOLD;
        if ((isLeftEdge || isRightEdge) && currentMode === edit) {
            stage.container().style.cursor = "ew-resize";
        } else if (currentMode === edit) {
            let cursorType = "default";
            stage.container().style.cursor = cursorType;
        }

        // if the user is trying to adjust the segment!
        // if the pointer is down and the pointer is either in the right or left edge of the segment;
        if (pointerDown.current && (isRightEdge || isLeftEdge)) {
            if ((rectX - pointerX) < 0) {
                console.log("move right!");
            } else if ((rectX - pointerX) > 0) {
                console.log("Move left!");
            }
        }

    }

    const handleMouseLeave = function (e) {
        let cursorType = "default";
        if (currentMode === edit) {
            e.target.getStage().container().style.cursor = cursorType;
        }
    }

    const handlePointerDown = function (e) {
        pointerDown.current = true;
    }

    const handlePointerUp = function () {
        pointerDown.current = false;
        console.log("pointer up!");
    }

    const handleClick = function () {
        if (currentMode === select || currentMode === edit) {
            setSelectedSegmentId(id);
        }
    }

    // const isLeftEdge =

    return (
        <Rect
            ref={segmentRectRef}
            // opacity={0.3}
            width={width} height={79.5}
            fill={segmentColor}
            // nop need to subtract scrollLeft because the layer itself is being offset instead of individutally calculating everything!
            x={startWX}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            strokeWidth={selectedSegmentId === id ? 2 : 0}
            stroke={"#2b7fff"}
            onClick={handleClick}
        />
    )

}

// edits the segment start and endTime based on the drag!
const resizeSegment = function ({}) {

}




export default SegmentRect;