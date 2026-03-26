export const calculateTickers = function ({scrollLeft, pxPerSec, viewportWidth, videoDuration}) {
    `
        This function calculates how many tickers can fit for the given clientWidth of the app and also given that how long the user has zoomed!(pxPerSec)
        pxPerSec: how many px of gap between each second
        based on how long the user has scrolled! the time duration start and end are calculated
    `
    // for ui timeline
    const startSec = Math.floor(scrollLeft / pxPerSec);
    // End second calculated according to viewport width
    const endSecViewport = Math.ceil((scrollLeft + viewportWidth) / pxPerSec);
    // End second calculated according to video duration
    const endSecVideo = Math.ceil(videoDuration);
    // End second/tickers capped to the max duration of the video!
    const endSec = Math.min(endSecViewport, endSecVideo);

    // contains all the durations that would fit into the viewportwidth and also makes sure it is within the video duration!
    const durationSeconds = [];
    for (let i=startSec; i<endSec; i++) {
        durationSeconds.push(i);
    }

    return durationSeconds;
}