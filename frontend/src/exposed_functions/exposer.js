import useDownloadStore from "../hooks/useDownloadStore.js";
import toast from "react-hot-toast";
import {truncate} from "../utils/utils.js";
import download from "../components/pages/Download.jsx";
import useSegmentDownloadStore from "../../store/useSegmentDownloadStore.js";

const downloadStore = useDownloadStore.getState();
const segmentDownloadStore = useSegmentDownloadStore.getState();

window.addEventListener("pywebviewready", () => {
    window.updateProgressFromPy = function (data) {
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

    window.downloadError = function (data) {
        const {ok, status, details, metadata} = data;
        const {title="", id, url} = metadata;
        console.log(data);
        const {removeDownload, downloads} = useDownloadStore.getState();
        console.log(downloads);
        removeDownload(id);
        toast.error(`Failed to download ${truncate(title, 10)} ${details}`, {duration: 6000});
        return "";
    }

    window.segmentDownloadProgress = function (data) {
        console.log(data);
        const {id, progressPercent, ...rest} = data;
        segmentDownloadStore.updateDownload(id, {id, progress: progressPercent, ...rest});
    }

    window.segmentDownloadComplete = function (data) {
        console.log(data);
        const {id, downloaded, processing} = data;
        segmentDownloadStore.downloadComplete(id, processing, downloaded);

        console.log(segmentDownloadStore.downloads)
    }

});


