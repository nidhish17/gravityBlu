import VideoCard from "../ui/VideoCard.jsx";
import useDownloadStore from "../../hooks/useDownloadStore.js";

const Downloading = function () {
    const downloads = useDownloadStore((state) => state.downloads);

    if (!downloads.length) return (
        <>
            <hr className="text-gray-500/60"/>
            <h2 className="text-xl font-bold text-center">No videos are being downloaded currently</h2>
        </>
    );
    return (
        <div className="flex flex-col gap-y-4 grow">
            <hr className="text-gray-500/60"/>
            <div className="relative grow">
                <div className="absolute h-full w-full overflow-y-scroll flex flex-col gap-y-4 pb-4 no-scrollbar">
                    {downloads.map((videoDownload, i) => {
                        const {downloaded, videoThumbImg, id, videoTitle, videoHeight, progress, processing, downloadType, ...rest} = videoDownload;
                        // console.log(videoDownload);
                        return (
                            <VideoCard
                                downloaded={downloaded}
                                key={`${id}${i}`}
                                videoTitle={videoTitle}
                                thumbImgLink={videoThumbImg}
                                selectedQuality={videoHeight}
                                progress={progress}
                                processing={processing}
                                progressDetail={{...rest}}
                                downloadType={downloadType}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Downloading;