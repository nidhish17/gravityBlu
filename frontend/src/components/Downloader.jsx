import {useState} from "react";
import Section from "./ui/Section.jsx";
import Download from "./pages/Download.jsx";
import Downloaded from "./pages/Downloaded.jsx";
import {FaDownload} from "react-icons/fa";
import Downloading from "./pages/Downloading.jsx";
import useDownloadStore from "../hooks/useDownloadStore.js";
import useSegmentDownloadStore from "../../store/useSegmentDownloadStore.js";

const Downloader = function ({page, setPage}) {

    const normalDownloads = useDownloadStore((state) => state.getTotalDownloading())
    const segmentDownloads = useSegmentDownloadStore((state) => state.getTotalDownloads())
    const totalVideosDownloading = normalDownloads + segmentDownloads;


    const renderPage = function () {
        if (page === "download") {
            return <Download />;
        } else if (page === "finished") {
            return <Downloaded videosDownloading={totalVideosDownloading} />
        } else if (page === "downloading") {
            return <Downloading/>
        }
    }


    return (
        <Section className={`flex flex-col gap-y-6 basis-full h-full`}>
            {renderPage()}
            {/*this is the page renderer and the above is the navbar for setting what page to load*/}
            {/*{page === "download" ? <Download loading={loading} setLoading={setLoading}/> : page === "downloading" ?*/}
            {/*    <Downloading/> : page === "finished" && <Downloaded videosDownloading={totalVideosDownloading} />}*/}
        </Section>
    );
}

export default Downloader;