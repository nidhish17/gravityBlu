export const calculateTickers = function ({scrollLeft, pxPerSec, viewportWidth}) {
    `
        This function calculates how many tickers can fit for the given clientWidth of the app and also given that how long the user has zoomed!(pxPerSec)
        pxPerSec: how many px of gap between each second
        based on how long the user has scrolled! the time duration start and end are calculated
    `
    // for ui timeline
    const startSec = Math.floor(scrollLeft / pxPerSec);
    const endSec = Math.ceil((scrollLeft + viewportWidth) / pxPerSec);

    // contains all the durations that would fit into the viewportwidth
    const durationSeconds = [];
    for (let i=startSec; i<endSec; i++) {
        durationSeconds.push(i);
    }

    return durationSeconds;
}