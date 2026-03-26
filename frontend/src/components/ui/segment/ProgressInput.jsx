import {useEffect, useRef, useState} from "react";
import {formatSecondsToHHMMSS} from "../../../utils/utils.js";
import {FaPause, FaPlay} from "react-icons/fa";

const ProgressInput = function ({videoDuration, videoRef}) {

    const inputRef = useRef(null);
    const durationLabelRef = useRef(null);
    const timeIndicator = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = function () {
            setIsPlaying(true);
        }

        const handlePause = function () {
            setIsPlaying(false);
        }

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        return () => {
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
        }
    }, []);

    // updates input indicator to the video's current time
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        }
    }, []);

    const handlePlayPause = function () {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    const handleTimeUpdate = function () {
        const video = videoRef.current;
        if (!video) return;

        if (inputRef.current) {
            const current = video.currentTime;
            const duration = video.duration || videoDuration;

            inputRef.current.value = current;

            const percent = (current / duration) * 100;
            inputRef.current.style.backgroundSize = `${percent}% 100%`;
        }
        if (durationLabelRef.current) {
            durationLabelRef.current.textContent = formatSecondsToHHMMSS(video.currentTime);
        }
    }

    const handleSeek = function (e) {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = parseFloat(e.target.value);
        handleTimeUpdate();
    }

    const handleMouseMove = function (e) {
        const indicator = timeIndicator.current;
        const input = inputRef.current;
        const video = videoRef.current;
        if (!indicator || !input || !video) return;

        const rect = input.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        indicator.style.left = `${offsetX}px`;

        // display the timestamp
        const duration = video.duration || videoDuration;
        const timestamp = (Number(offsetX) / rect.width) * duration;
        indicator.textContent = formatSecondsToHHMMSS(timestamp);
    }

    return (
        <div className="flex items-center gap-x-2">
            <button className="cursor-pointer" onClick={handlePlayPause}>
                {isPlaying ? <FaPause/> : <FaPlay/>}
            </button>
            <div className="w-full group relative flex items-center">
                <input
                    ref={inputRef} defaultValue={0}
                    type="range"
                    id="video-progress-input"
                    className="w-full"
                    onInput={handleSeek}
                    onMouseMove={handleMouseMove}
                    step={0.1} min={0} max={videoDuration}
                />
                <p ref={timeIndicator}
                   className="absolute px-2 py-1 bg-neutral-600 rounded bottom-2 pointer-events-none text-center hidden group-hover:block -translate-x-1/2"></p>
            </div>
            <p ref={durationLabelRef} className="px-2 py-1 rounded bg-gray-800">00:00:00</p>
        </div>
    );
}

export default ProgressInput;