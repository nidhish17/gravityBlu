import Section from "../components/Section.jsx";
import GlobalHeader from "../components/GlobalHeader.jsx";
import DownloadPageHero from "../components/DownloadPageHero.jsx";
import {FaDownload} from "react-icons/fa";
import {useEffect, useState} from "react";
import {formatBytes, formatReleaseDate} from "../utils/utils.js";
import {BsCameraVideoFill} from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function DownloadSoftware() {

    const [isLoading, setIsLoading] = useState(false);
    const [updateData, setUpdateData] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const res = await fetch("https://api.github.com/repos/nidhish17/gravityblu/releases/latest", {
                    headers: {
                        Accept: "application/vnd.github+json"
                    }
                });
                const data = await res.json();
                const {body, published_at, tag_name, html_url, assets} = data;
                // assets is an array; it returns an array inside houses objects
                const [{size, browser_download_url}] = assets;
                setUpdateData({
                    body,
                    published_at,
                    version: tag_name,
                    html_url,
                    size,
                    browser_download_url
                })
                console.log(body);
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const {size, body, published_at, version, html_url, browser_download_url} = updateData ?? {};
    return (
        <>
            <GlobalHeader>
                <DownloadPageHero version={version} releaseDate={!isLoading && formatReleaseDate(published_at)} />
            </GlobalHeader>
            <main className="max-w-screen-2xl mx-auto">
                <Section className="flex flex-col lg:flex-row gap-12">
                    <div className={`basis-1/2 justify-between rounded-xl bg-gradient-to-br from-violet-950 via-pink-900/80 to-cyan-900/80 p-6 flex flex-col gap-5 ${isLoading && "animate-pulse"}`}>
                        <div className="flex items-center justify-center flex-col">
                            <FaDownload size={50} />
                            <h1 className="text-3xl font-sans font-bold">GravityBlu v{version}</h1>
                        </div>
                        {/*app details like file size*/}
                        <div className="flex flex-col gap-y-4 text-white/90 font-medium">
                            <InfoRow label={"File Size: "}>{formatBytes(size)}</InfoRow>
                            <InfoRow label="Platform">Windows 10/11</InfoRow>
                            <InfoRow label="License">MIT</InfoRow>
                            <InfoRow label="Release Date">{formatReleaseDate(published_at)}</InfoRow>
                        </div>
                        {/*download button*/}
                        <a
                            href={browser_download_url}
                            className="bg-white/90 text-black px-4 py-3 rounded hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer font-medium w-full flex items-center justify-center gap-x-4 disabled:opacity-60"
                            rel="noopener noreferrer"
                        >
                            <FaDownload />
                            Download v{version}
                        </a>
                    </div>


                    <div className="basis-1/2 space-y-4">
                        <h1 className="text-2xl font-bold">Download Features</h1>
                        <div className="space-y-6">
                            {/*available features card*/}
                            <div className="bg-gray-900 rounded-xl p-5 space-y-4">
                                <h4 className="text-violet-400 font-semibold">Available Options</h4>
                                <div className="flex flex-col gap-y-4">
                                    <InfoRow label={<span className="flex gap-2 items-center justify-center"><FaDownload className="text-violet-400" /> Parallel Downloads</span>}>
                                        <span className="text-green-400">Enabled</span>
                                    </InfoRow>
                                    <InfoRow label={<span className="flex gap-2 items-center justify-center"><BsCameraVideoFill className="text-pink-400" /> 2k quality support</span>}><span className="text-green-400">Free</span></InfoRow>
                                    <InfoRow label={<span className="flex gap-2 items-center justify-center"><BsCameraVideoFill className="text-orange-400" /> 4k quality support</span>}><span className="text-green-400">Free</span></InfoRow>
                                    <InfoRow label={<span className="flex gap-2 items-center justify-center"><BsCameraVideoFill className="text-yellow-400" /> 8k quality support</span>}><span className="text-green-400">Free</span></InfoRow>
                                </div>
                            </div>
                            {/*quick stats card*/}
                            <div className="bg-gray-900 rounded-xl p-5 space-y-4">
                                <h4 className="text-cyan-400 font-semibold">Quick Stats</h4>
                                <div className="grid grid-cols-2 gap-2 uppercase justify-items-center text-center">
                                    <div className="">
                                        <p className="text-lg font-semibold text-green-500">Free</p>
                                        <p className="text-gray-400 text-xs tracking-tighter font-sans">Downloads</p>
                                    </div>

                                    <div className="">
                                        <p className="text-lg font-semibold text-blue-500">Fast</p>
                                        <p className="text-gray-400 text-xs tracking-tighter font-sans">Speed</p>
                                    </div>

                                    <div className="">
                                        <p className="text-lg font-semibold text-purple-500">Easy</p>
                                        <p className="text-gray-400 text-xs tracking-tighter font-sans">Setup</p>
                                    </div>

                                    <div className="">
                                        <p className="text-lg font-semibold text-yellow-500">Parallel</p>
                                        <p className="text-gray-400 text-xs tracking-tighter font-sans">Downloads</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Section>

                <Section className="bg-gradient-to-br from-violet-950 via-pink-900/80 to-cyan-900/80">
                    <div className="flex flex-col gap-y-16">
                        <h1 className="text-4xl text-center md:text-5xl font-black">What's New in v{version}</h1>
                        
                        <div className="gap-5 bg-black/20 p-6 rounded-md">
                            <h2 className="text-xl font-bold text-center">Description</h2>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                            >
                                {body}
                            </ReactMarkdown>
                        </div>
                    </div>
                </Section>


            </main>
            {/*<GlobalFooter />*/}
        </>
    );
}

export default DownloadSoftware;

const InfoRow = function ({label, children}) {
    return <div className="flex items-center justify-between gap-x-3">
        <p className="text-white/80">{label}</p>
        <div className="text-white">{children}</div>
    </div>
}

const FeatureCard = function ({label, children}) {
    return (
        <div className="p-6 bg-black/20 rounded-xl space-y-4">
            <h2 className="font-black text-2xl font-mono tracking-tight">{label}</h2>
            <ul className="flex flex-col gap-y-1 items-start justify-center text-center *:flex *:items-center *:justify-center *:gap-x-2">
                {children}
            </ul>
        </div>
    )
}



/*

*/
