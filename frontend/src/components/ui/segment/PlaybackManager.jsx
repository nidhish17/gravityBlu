import {FaClock} from "react-icons/fa";
import TimelineUseReducer from "./TimelineUseReducer.jsx";
import {useEffect, useReducer, useRef} from "react";
import {MAX_ZOOM, MIN_ZOOM, MODE_NAMES} from "./constants.js";
import {calculateTickers} from "./utils.js";
import Konva from "konva";
import {formatSecondsToHHMMSS} from "../../../utils/utils.js";
import {MdOutlineFileDownload} from "react-icons/md";


const initialState = {
    timelineHeight: 80,
    viewportWidth: 0,
    pxPerSec: 10,
    mode: MODE_NAMES.select,
}

const timelineReducer = function (state, action) {
    switch (action.type) {
        case "SET_VIEWPORT_WIDTH":
            return {...state, viewportWidth: action.payload};
        case "SET_TIMELINE_HEIGHT":
            return {...state, timelineHeight: action.payload};
        case "ZOOM_IN":
            return {...state, pxPerSec: Math.min(state.pxPerSec+1, MAX_ZOOM)};
        case "ZOOM_OUT":
            return {...state, pxPerSec: Math.max(state.pxPerSec-1, MIN_ZOOM)};
        case "CHANGE_MODE":
            return {...state, mode: action.payload};
        default:
            return state;
    }
}

const PlaybackManager = function ({videoInfo}) {
    // NOTE:- the streaming_url here means the preview url for the video
    const {videoTitle="", streaming_url="", videoDuration="", durationSeconds=0} = videoInfo || {};

    const scrollLeftRef = useRef(0);
    const timelineLayerRef = useRef(null);
    const handleScroll = function (e) {
        scrollLeftRef.current = e.target.scrollLeft;

        const layer = timelineLayerRef.current;
        if (layer) {
            layer.offsetX(scrollLeftRef.current);
            layer.batchDraw();
        }

        updateTickers();
    }

    const [state, dispatch] = useReducer(timelineReducer, initialState);
    const {pxPerSec, viewportWidth, timelineHeight} = state;

    // when the component unmounts remove the RAF!
    useEffect(() => {
        return function cleanup() {
            stopPlayHead();
        }
    }, []);

    useEffect(() => {
        updateTickers();
        updatePlayHead();
    }, [pxPerSec]);


    const videoRef = useRef(null);
    const playHeadRef = useRef(null);
    const tickersGroupRef = useRef(null);
    const timelineContainerRef = useRef(null);


    const rafId = useRef(null);
    const isAnimatingRef = useRef(false);

    // DEVeloper Notice: do not use this function directly use its wrappers instead. treat this as a private method
    const animatePlayHead = function () {
        const video = videoRef.current;
        const line = playHeadRef.current;
        if (!video || !line) return;

        const x = video.currentTime * pxPerSec;
        line.points([x, 0, x, timelineHeight]);
        line.getLayer().batchDraw();

        rafId.current = requestAnimationFrame(animatePlayHead);
    }

    const startPlayHead = function () {
        if (isAnimatingRef.current) return;

        isAnimatingRef.current = true;
        animatePlayHead();
    }

    const updatePlayHead = function () {
        if (isAnimatingRef.current) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
        animatePlayHead();
    }

    const stopPlayHead = function () {
        isAnimatingRef.current = false;

        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
    }

    const updateTickers = function () {
        const group = tickersGroupRef.current;
        if (!group) return;

        const scrollLeft = scrollLeftRef.current;

        const newTickers = calculateTickers({scrollLeft, pxPerSec, viewportWidth});
        group.destroyChildren();

        newTickers.forEach((curSec) => {
            const isMajor = curSec % 5 === 0;
            const x = (curSec * pxPerSec);

            if (isMajor) {
                const text = new Konva.Text({
                    text: formatSecondsToHHMMSS(curSec),
                    x: x - 15, y: 1,
                    fontSize: 8, fill: "white",
                });
                group.add(text);
            }

            // the ticker line!
            const rect = new Konva.Rect({
                width: 1.5, height: isMajor ? 14 : 7,
                x: x, y: 10, fill: "white",
            });
            group.add(rect);

        });

        group.getLayer().batchDraw();
    }



    return (
        <div className="w-full space-y-6 *:ring-2 *:ring-offset-4 *:ring-offset-neutral-900 *:ring-gray-700 *:rounded *:p-2 mb-6">
            {/*video preview*/}
            <div className="flex gap-4 relative">
                <video
                    src={streaming_url} ref={videoRef}
                    className={`aspect-video w-90 rounded bg-black`}
                    autoPlay={true} loop controls
                    onLoadedData={updateTickers}
                    onPlay={startPlayHead}
                    onPause={stopPlayHead}
                    onEnded={stopPlayHead}
                >
                </video>


                <div className="self-stretch flex flex-col justify-between">
                    <div className="space-y-2">
                        <p className="p-2 bg-gray-800 rounded px-4">{videoTitle}</p>
                        <p className="w-fit text-sm flex gap-1 items-center px-3 rounded-full py-1 bg-gray-800"><FaClock className="fill-stone-500" size={18} /> {videoDuration}</p>
                    </div>
                    <button className="bg-lime-600 hover:bg-lime-600/80 ring-2 self-start
                    ring-offset-4 ring-offset-gray-800 ring-lime-500 hover:ring-offset-0 transition-all cursor-pointer
                    duration-200 font-semibold px-4 py-2 rounded flex gap-x-1 items-center justify-center
                    disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default
                    disabled:ring-stone-500/80 disabled:transition-none">
                        <MdOutlineFileDownload size={25} />
                        Download All Segments
                    </button>
                </div>
            </div>

            <TimelineUseReducer
                videoDuration={durationSeconds}
                playHeadRef={playHeadRef}
                scrollLeftRef={scrollLeftRef}
                tickersGroupRef={tickersGroupRef}
                timelineContainerRef={timelineContainerRef}
                state={state} dispatch={dispatch}
                handleScroll={handleScroll}
                timelineLayerRef={timelineLayerRef}
            />
        </div>
    );
}

export default PlaybackManager;

