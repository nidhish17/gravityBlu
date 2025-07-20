import useDownloadStore from "../hooks/useDownloadStore.js";

const downloadStore = useDownloadStore.getState();

window.addEventListener("pywebviewready", () => {
    window.updateProgressFromPy = function (data) {
        // const data = {progress, eta, speed, downloaded};
        // console.log(data);
        const {progressPercent: progress, id, ...rest} = data;
        // console.log(rest);
        downloadStore.updateDownloadProgress(id, {progress, id, ...rest});
        return "";
    }

    // this function is used to notify that a particular video has been downloaded and need to pop it from downloading
    // ie setting downloaded state to true
    window.videoDownloadComplete = function (data) {
        const {id, downloaded, processing} = data;
        console.log(id);
        console.log("is video processing ? ", processing, "downloaded ? ", downloaded);
        downloadStore.downloadComplete(id, processing, downloaded);
        return "";
    }

})


