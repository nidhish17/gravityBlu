import {IoMdCut} from "react-icons/io";
import {formatSecondsToHHMMSS} from "../../utils/utils.js";
import {Layer, Line, Rect, Stage, Text} from "react-konva";
import {useEffect, useRef, useState, Fragment} from "react";
import {FaMinus, FaPlus} from "react-icons/fa";


const Timeline = function ({videoDuration}) {

    const timelineContainerRef = useRef(null);
    const hoverLineRef = useRef(null);

    const [timelineHeight, setTimelineHeight] = useState(80);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [pxPerSec, setPxPerSec] = useState(10);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleScroll = function (e) {
        setScrollLeft(e.target.scrollLeft);
    }

    // for ui timeline
    const startSec = Math.floor(scrollLeft / pxPerSec);
    const endSec = Math.ceil((scrollLeft + viewportWidth) / pxPerSec);

    const durationSeconds = [];
    for (let i=startSec; i<endSec; i++) {
        durationSeconds.push(i);
    }

    const handleTimelineZoom = function (e) {
        if (e.currentTarget.name === "increment") {
            if (pxPerSec < 20) {
                setPxPerSec((prev) => prev + 1);
            }
        } else if (e.currentTarget.name === "decrement") {
            if (pxPerSec > 7) {
                setPxPerSec((prev) => prev - 1);
            }
        }
    }

    useEffect(() => {
        if (timelineContainerRef.current) {
            setTimelineHeight(timelineContainerRef.current.getBoundingClientRect().height);
        }
        if (timelineContainerRef.current) {
            setViewportWidth(timelineContainerRef.current.clientWidth);
        }
    }, []);

    const minZoom = 7;
    const maxZoom = 20;
    const zoomPercentage = Math.round(
        ((pxPerSec - minZoom) / (maxZoom - minZoom)) * 100
    );

    const isDragging = useRef(false);
    const pointerDown = useRef(false);

    const activeSegmentRefStartTime = useRef(null);
    const [segments, setSegments] = useState([]);


    const handleMouseMove = function (e) {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;

        hoverLineRef.current.points([pos.x, 0, pos.x, timelineHeight]);
        hoverLineRef.current.getLayer().batchDraw();
        if (pointerDown.current) {
            isDragging.current = true;
        }
    }

    const handleMouseDown = function (e) {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;

        const pointerX = pos.x;
        const timelinePos = (pointerX + scrollLeft) / pxPerSec;
        const sec = Math.round(timelinePos);

        pointerDown.current = true;

        activeSegmentRefStartTime.current = sec;
        console.log(`Time: ${formatSecondsToHHMMSS(sec)}`);
    }

    const handleMouseUp = function (e) {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;

        const pointerUpX = pos.x;
        const timelinePos = (pointerUpX + scrollLeft) / pxPerSec;
        const sec = Math.round(timelinePos);

        isDragging.current = false;
        pointerDown.current = false;

        const newSegment = {startTime: activeSegmentRefStartTime.current, endTime: sec};
        setSegments((prevSegments) => [...prevSegments, newSegment]);

        console.log(`Time Up: ${formatSecondsToHHMMSS(sec)}`);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border p-2">
                <div className="flex items-center gap-1">
                    <IoMdCut className="bg-rose-700/30 p-1 rounded" size={20} />
                    <h4 className="text-lg">Click and drag to create segments.</h4>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={handleTimelineZoom} name="decrement" className="rounded-full p-1 ring-2"><FaMinus /></button>
                    <span className="font-mono tabular-nums w-10 text-center">{zoomPercentage}%</span>
                    <button onClick={handleTimelineZoom} name="increment" className="rounded-full p-1 ring-2"><FaPlus /></button>
                </div>
            </div>

            <div ref={timelineContainerRef} className="relative bg-neutral-800 h-22 ring ring-neutral-700 p-px borde">

                <div onScroll={handleScroll} className="w-full overflow-x-scroll overflow-y-hidden timeline-scrollbar absolute bottom-0">
                    <div
                        style={{ width: pxPerSec * videoDuration, height: 1 }}
                        className={""}
                    />
                </div>

                <div className="absolute pointer-events-none inset-0">
                    {/*track*/}
                    <Stage
                        className={`hover:cursor-crosshai pointer-events-auto`}
                        width={viewportWidth}
                        height={80}
                        onMouseMove={handleMouseMove}
                        onPointerDown={handleMouseDown}
                        onPointerUp={handleMouseUp}
                    >
                        <Layer>
                            <Line
                                stroke="oklch(58.6% 0.253 17.585)"
                                strokeWidth={2}
                                opacity={0.5}
                                ref={hoverLineRef}
                            />

                            {durationSeconds.map((curSec, idx) => {
                                const isMajor = curSec % 5 === 0;
                                if (!isMajor) return (
                                    <Rect
                                            key={curSec}
                                            width={1.5} height={7}
                                            x={(curSec * pxPerSec) - scrollLeft} y={10}
                                            fill={"#A4A4A4"}
                                    />
                                );
                                return (
                                    <Fragment key={curSec}>
                                        <Text text={formatSecondsToHHMMSS(curSec)}
                                              // -15 is for centering the text
                                              x={((curSec * pxPerSec) - scrollLeft) - 15} y={1}
                                              fontSize={8} fill="white"
                                        />
                                        <Rect
                                            width={1} height={14}
                                            x={(curSec * pxPerSec) - scrollLeft} y={10}
                                            fill={"#A4A4A4"}
                                        />
                                    </Fragment>
                                )
                            })}

                        </Layer>
                    </Stage>
                    {/*track*/}
                </div>


            </div>

        </div>
    );
}

// export default Timeline;










