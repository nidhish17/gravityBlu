import {IoMdCut} from "react-icons/io";
import {formatSecondsToHHMMSS, generateRandomRgbaColor} from "../../../utils/utils.js";
import {Group, Layer, Line, Rect, Stage, Text} from "react-konva";
import {useEffect, useRef, useState, Fragment, useReducer} from "react";
import {FaMinus, FaPlus} from "react-icons/fa";
import toast from "react-hot-toast";
import SegmentControls from "./SegmentControls.jsx";
import SegmentRect from "./SegmentRect.jsx";
import TimelineModes from "./TimelineModes.jsx";
import {MAX_ZOOM, MIN_SEGMENT_DURATION, MIN_ZOOM, MODE_NAMES} from "./constants.js";
import ProgressInput from "./ProgressInput.jsx";


const  TimelineUserReducer = function ({videoDuration, segments, setSegments, playHeadRef, scrollLeftRef, handleScroll, tickersGroupRef, timelineContainerRef, state, dispatch, timelineLayerRef, videoRef, seekTo, segmentCount, incrementSegmentCount}) {
    const scrollLeft = scrollLeftRef.current;
    const {pxPerSec, viewportWidth, timelineHeight, mode: currentMode} = state;

    // const [durationSeconds, setDurationSeconds] = useState(calculateTickers({scrollLeft, pxPerSec, viewportWidth}));

    // zooms in/out the timeline. ps:- is just increases the space b/w tick so it appears as zoomed in;ie increasing pxPerSec
    const handleTimelineZoom = function (e) {
        if (e.currentTarget.name === "increment") {
            dispatch({type: "ZOOM_IN"});
        } else if (e.currentTarget.name === "decrement") {
            dispatch({type: "ZOOM_OUT"});
        }
    }

    // sets width and height of the timeline!
    function setTimelineWandH () {
        if (timelineContainerRef.current) {
            const timelineHeight = timelineContainerRef.current.getBoundingClientRect().height;
            dispatch({type: "SET_TIMELINE_HEIGHT", payload: timelineHeight});
        }
        if (timelineContainerRef.current) {
            const viewportWidth = timelineContainerRef.current.clientWidth;
            dispatch({type: "SET_VIEWPORT_WIDTH", payload: viewportWidth});
        }
    }

    // set timeline width and timeline height
    useEffect(() => {
        setTimelineWandH();
        window.addEventListener("resize", setTimelineWandH);
        return () => window.removeEventListener("resize", setTimelineWandH);
    }, []);

    // ui object shows %zoomed
    const zoomPercentage = Math.round(
        ((pxPerSec - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100
    );

    // Dragging functionality components
    const isDragging = useRef(false);
    const pointerDown = useRef({pointerDown: false});

    // used to record the start time when the mouseDown is fired.
    const activeSegmentRefStartTime = useRef(null);
    const [selectedSegmentId, setSelectedSegmentId] = useState(null);
    // console.log(segments);

    // for deleting a specific segment!
    const deleteSegment = function (segId) {
        setSegments((segments) => (
            segments.filter((seg) => seg.id !== segId)
        ));
    }

    // edit segment name and when it starts and when it ends
    // Todo: implement editing when the segment start and ends
    const editSegment = function ({segId, name, startSec, endSec}) {
        setSegments((segments) => (
            segments.map((seg) => {
                if (seg.id === segId) {
                    return {
                        ...seg,
                        name: name
                        // Todo: later add startTime and endTime too here
                    }
                }
                return seg;
            })
        ))
    }

    // change modes function
    const changeMode = function (mode) {
        dispatch({type: "CHANGE_MODE", payload: mode});
    }


    // const activeSegmentRectRef = useRef(null);
    const selectionMarqueeRect = useRef( null);

    const handleMouseMove = function (e) {
        const stage = e.target.getStage();
        const layer = timelineLayerRef.current;
        const pos = layer.getRelativePointerPosition();
        if (!pos) return;

        // hoverLineRef.current.points([pos.x, 0, pos.x, timelineHeight]);
        // hoverLineRef.current.getLayer().batchDraw();

        if (pointerDown.current.pointerDown) {
            isDragging.current = true;
        }
        if (pointerDown.current.pointerDown && isDragging) {
            const {pointerDownPosX: initialX, pointerDownWorldX} = pointerDown.current;
            drawSelectionMarquee(
                {initialX: pointerDownWorldX, currentX: pos.x,
                    selectionMarqueeRect: selectionMarqueeRect.current,
                    height: timelineHeight, scrollLeft
                }
            );
        }

    }

    const handleMouseDown = function (e) {
        const stage = e.target.getStage();
        const layer = timelineLayerRef.current;
        const pos = layer.getRelativePointerPosition();
        if (!pos) return;

        const pointerX = pos.x;
        const worldX = pointerX //+ scrollLeft
        const timelinePos = worldX / pxPerSec;
        const sec = Math.round(timelinePos);

        pointerDown.current = {...pointerDown.current, pointerDown: true, pointerDownPosX: pointerX, pointerDownWorldX: worldX};

        activeSegmentRefStartTime.current = {startSec: sec};
        console.log(`Time: ${formatSecondsToHHMMSS(sec)}`);

    }

    const handleMouseUp = function (e) {
        const stage = e.target.getStage();
        const layer = timelineLayerRef.current;
        const pos = layer.getRelativePointerPosition();
        if (!pos) return;

        const pointerUpX = pos.x;
        const worldX = pointerUpX //+ scrollLeft;
        const timelinePos = worldX / pxPerSec;
        const sec = Math.round(timelinePos);

        isDragging.current = false;
        pointerDown.current = {...pointerDown.current, pointerDown: false};
        removeSelectionMarquee({selectionMarqueeRect: selectionMarqueeRect.current});

        // if the user is in create segments mode only then allow the user to create segments else no!
        if (currentMode === MODE_NAMES.create) {
            const {startSec} = activeSegmentRefStartTime.current;
            const totalSegDuration = Math.abs(sec - startSec);

            if (totalSegDuration < MIN_SEGMENT_DURATION) {
                toast.error(`segment duration should be greater than ${MIN_SEGMENT_DURATION-1} secs.`, {duration: 3000, position: "top-center", style: {background: "rgba(255, 255, 255, 0.8)"}});
                return;
            }

            // Normalize segment boundaries so startTime is always <= endTime,
            // regardless of drag direction (user may drag left or right)
            // sec(mouseup coord/sec) -> endTime
            const timeStart = Math.min(startSec, sec);
            const timeEnd = Math.max(startSec, sec);

            // Don't allow segment creation if the end time exceeds video duration or start time exceeds video duration
            if (timeEnd > videoDuration || timeStart > videoDuration) {
                toast.error("Segment time cannot exceed video duration.", {duration: 3000, position: "top-center", style: {background: "rgba(255, 255, 255, 0.8)"}});
                return;
            }

            const segmentColor = generateRandomRgbaColor(0.5);
            incrementSegmentCount();
            const newSegment = {id: crypto.randomUUID(), startTime: timeStart, endTime: timeEnd, segmentColor, name: `Segment ${segmentCount}`};
            setSegments((prevSegments) => [...prevSegments, newSegment]);
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <ProgressInput videoDuration={videoDuration} videoRef={videoRef} />
                <div className="flex items-center justify-between gap-2 border p-2">
                    <div className="flex items-center gap-1">
                        <IoMdCut className="bg-rose-700/30 p-1 rounded" size={20} />
                        <h4 className="text-lg">Click and drag to create segments.</h4>
                    </div>
                    <TimelineModes currentMode={currentMode} setMode={changeMode} />
                    <div className="flex gap-3 items-center">
                        <button onClick={handleTimelineZoom} name="decrement" className="rounded-full p-1 ring-2"><FaMinus /></button>
                        <span className="font-mono tabular-nums w-10 text-center">{zoomPercentage}%</span>
                        <button onClick={handleTimelineZoom} name="increment" className="rounded-full p-1 ring-2"><FaPlus /></button>
                    </div>
                </div>
            </div>

            <div ref={timelineContainerRef} className="relative bg-neutral-800 h-22 ring ring-neutral-700 p-px borde">
                {/*overflow container*/}
                <div onScroll={handleScroll} className="w-full overflow-x-scroll overflow-y-hidden timeline-scrollbar absolute -bottom-0">
                    <div
                        style={{ width: pxPerSec * videoDuration, height: 1 }}
                        className={""}
                    />
                </div>

                <div className="absolute pointer-events-none inset-0">
                    {/*track*/}
                    <Stage
                        className={`pointer-events-auto`}
                        width={viewportWidth}
                        height={80}
                        onMouseMove={handleMouseMove}
                        onPointerDown={handleMouseDown}
                        onPointerUp={handleMouseUp}
                        onMouseEnter={(e) => {
                            const stage = e.target.getStage();
                            let cursorType = "default";
                            if (currentMode === MODE_NAMES.create){
                                cursorType = "crosshair";
                            } else cursorType = "default";
                            stage.container().style.cursor = cursorType;
                        }}
                    >
                        <Layer ref={timelineLayerRef}>
                            {/*Timeline red line*/}
                            <Line
                                stroke="oklch(58.6% 0.253 17.585)"
                                strokeWidth={2}
                                opacity={1}
                                ref={playHeadRef}
                            />

                            {/*selection marquee Rect*/}
                            {currentMode !== MODE_NAMES.edit && (
                                <Rect ref={selectionMarqueeRect} />
                            )}


                            {/*Segments created by the user*/}
                            {/*contains the segment rect*/}
                            {segments.map((seg) => {
                                return (
                                    // contains the konva <Rect /> object along with other functionalities attached!
                                    <SegmentRect
                                        key={seg.id}
                                        segment={seg}
                                        pxPerSec={pxPerSec}
                                        selectedSegmentId={selectedSegmentId}
                                        setSelectedSegmentId={setSelectedSegmentId}
                                        currentMode={currentMode}
                                        timelineLayerRef={timelineLayerRef}
                                        seekTo={seekTo}
                                    />
                                )
                            })}

                            <Group ref={tickersGroupRef} />

                            {/*<Rect />*/}

                        </Layer>
                    </Stage>
                    {/*track*/}
                </div>

            </div>

            <SegmentControls
                segments={segments}
                deleteSegment={deleteSegment}
                editSegment={editSegment}
                selectedSegmentId={selectedSegmentId}
                setSelectedSegmentId={setSelectedSegmentId}
                seekTo={seekTo}
            />

        </div>
    );
}

const drawSelectionMarquee = function ({initialX, currentX, selectionMarqueeRect, height, scrollLeft}) {
    if (!selectionMarqueeRect) return;

    const width = currentX - initialX;
    selectionMarqueeRect.x(initialX);
    selectionMarqueeRect.width(width);
    selectionMarqueeRect.height(height);
    selectionMarqueeRect.fill("#3c096c");
    selectionMarqueeRect.opacity(0.5);
    selectionMarqueeRect.getLayer().batchDraw();
}

const removeSelectionMarquee = function ({selectionMarqueeRect}) {
    if (!selectionMarqueeRect) return;

    selectionMarqueeRect.width(0);
    selectionMarqueeRect.height(0);

}


export default TimelineUserReducer;










