import {useState} from "react";
import Section from "./ui/Section.jsx";
import Download from "./pages/Download.jsx";
import Downloaded from "./pages/Downloaded.jsx";
import {FaDownload} from "react-icons/fa";
import Downloading from "./pages/Downloading.jsx";
import useDownloadStore from "../hooks/useDownloadStore.js";

const Downloader = function () {

    const [page, setPage] = useState("download");
    const totalVideosDownloading = useDownloadStore((state) => state.getTotalDownloading())
    const [loading, setLoading] = useState(false);

    return (
        <Section className={`flex flex-col gap-y-6 basis-full`}>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-x-12">
                    <button onClick={() => setPage("download")}
                            className={`${page === "download" ? "text-xl font-semibold text-white" :
                                "text-gray-500 font-thin text-lg"} pb-2 cursor-pointer relative
                                ${page === "download" && "after after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:border-b-3 after:border-b-purple-600 after:rounded-b-xl"}`}>
                        Download
                    </button>

                    <button onClick={() => setPage("finished")}
                            className={`${page === "finished" ? "text-xl font-semibold text-white" :
                                "text-gray-500 font-thin text-lg"} pb-2 cursor-pointer relative
                                ${page === "finished" && "after after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:border-b-3 after:border-b-purple-600 after:rounded-b-xl"}`}>
                        Finished
                    </button>
                </div>

                <div className="">
                    <button onClick={() => setPage("downloading")}
                            className={`relative cursor-pointer bg-neutral-700 p-1 rounded 
                            ${page === "downloading" && "outline-purple-600 outline-2 outline-offset-2 shadow-purple-700 shadow-sm"}`}>
                        <FaDownload size={25}/>
                        <span className={`absolute rounded-full size-4 flex items-center justify-center bg-red-600
                            text-white top-0 right-0 text-xs font-bold translate-x-[60%] -translate-y-1/2`}>
                            <span>{totalVideosDownloading}</span>
                        </span>
                    </button>
                </div>

            </div>


            {page === "download" ? <Download loading={loading} setLoading={setLoading}/> : page === "downloading" ?
                <Downloading/> : page === "finished" && <Downloaded videosDownloading={totalVideosDownloading} />}


        </Section>
    );
}

export default Downloader;