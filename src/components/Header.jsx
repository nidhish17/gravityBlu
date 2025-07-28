import {IoCloseSharp} from "react-icons/io5";
import {useContext, useEffect, useRef, useState} from "react";
import {FaArrowDown} from "react-icons/fa";
import gbDemo from "../assets/gbdemo_compressed.mp4";
import {RefContext} from "./AppLayout.jsx";
import StyledLink from "./StyledLink.jsx";

function Header() {
    const [navOpen, setNavOpen] = useState(false);
    const {downloadRef, aboutRef, featureRef} = useContext(RefContext);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.25;
        }
    }, []);

    return (
        <>
            <div
                className={`fixed overflow-hidden backdrop-blur-lg sm:ring bg-white/10 px-4 max-w-screen-2xl h-screen sm:h-auto w-full sm:w-[calc(100%-4rem)] left-1/2 -translate-x-1/2 sm:top-8 rounded py-3 z-30 scale-y-0 sm:scale-y-100 transition-transform duration-300 ${navOpen ? "scale-y-100 origin-top" : "origin-bottom"}`}>
                <nav className="flex flex-col sm:flex-row items-center justify-between gap-y-10 relative">
                    <h1 onClick={() => {
                        window.scrollTo({ behavior: "smooth", top: 0 });
                        navOpen && setNavOpen(false);
                    }} className="font-semibold text-2xl self-start cursor-pointer">gravityBlu</h1>
                    <div
                        className="flex flex-col w-full sm:w-auto sm:flex-row items-center gap-x-3 gap-y-2 font-semibold text-lg">
                        <StyledLink onClick={() => {
                            featureRef.current?.scrollIntoView({ behavior: "smooth" })
                            navOpen && setNavOpen(false);
                        }}>Features</StyledLink>
                        <StyledLink onClick={() => {
                            downloadRef.current?.scrollIntoView({ behavior: "smooth" });
                            setNavOpen(false);
                        }}>Download</StyledLink>
                        <StyledLink onClick={() => {
                            aboutRef.current?.scrollIntoView({ behavior: "smooth" })
                            setNavOpen(false);
                        }}>About</StyledLink>
                    </div>
                    <span onClick={() => setNavOpen(false)}
                          className="inline-block p-3 absolute right-0 rounded bg-white/20 cursor-pointer sm:hidden">
                                <IoCloseSharp size={30}/>
                    </span>
                </nav>
            </div>

            <button onClick={() => setNavOpen(prev => !prev)}
                    className="px-4 py-3 rounded sm:hidden flex flex-col gap-1 bg-white/30 fixed right-5 top-5 z-20">
                <div className="h-0.5 w-6 bg-white"></div>
                <div className="h-0.5 w-6 bg-white"></div>
                <div className="h-0.5 w-6 bg-white"></div>
            </button>

            <header className="flex items-center justify-center min-h-fit h-fit pt-20 sm:pt-28 px-4 pb-8 sm:px-8 sm:pb-8 bg-gradient-to-br from-violet-950 via-pink-900/80 to-cyan-900/80">
                <section className="max-w-screen-2xl h-full">
                    <div className="flex gap-y-8 sm:flex-row sm:gap-x-4 h-full flex-col-reverse">
                        <div className="sm:basis-10/12 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-4xl font-semibold ">gravityBlu</h2>
                                <p className="text-white/50 sm:text-xl">
                                    An <a href="https://github.com/nidhish17/gravityBlu" className="text-blue-500" target="_blank">open-source</a> project, youtube downloader made for windows desktop. Download 1080p, 2k, 4k, 8k videos and audio for free.
                                </p>
                            </div>
                            {/*https://stackoverflow.com/questions/67150736/tailwind-background-gradient-transition*/}
                            <button
                                onClick={() => {
                                    downloadRef.current?.scrollIntoView({ behavior:"smooth" });
                                    navOpen && setNavOpen(false);
                                }}
                                className="group cursor-pointer bg-size-[200%_200%] bg-position-[0%_0%] hover:bg-position-[100%_100%] uppercase w-full sm:w-auto flex items-center justify-center gap-x-2 bg-gradient-to-br  to-indigo-900 via-violet-950 from-rose-950 transition-all duration-500 px-6 py-3 rounded-full text-lg font-semibold shadow-2xl hover:shadow-rose-900/70">
                                Download Now
                                <FaArrowDown size={18} className="animate-bounc group-hover:translate-y-[2.5px] transition-transform" />
                            </button>
                        </div>
                        <ComputerScreen image={false}>
                            <video src={gbDemo} ref={videoRef} autoPlay controls={false} muted loop controlsList="nofullscreen"></video>
                        </ComputerScreen>
                    </div>
                </section>
            </header>

        </>

    );
}



const ComputerScreen = function ({children, image}) {
    return (
        <div className="sm:basis-full flex flex-col">
            {/*header*/}
            <div className="h-8 bg-neutral-900 rounded-t-lg flex items-center p-4 justify-end gap-x-3">
                <div className="size-4 rounded-full bg-rose-700"></div>
                <div className="size-4 rounded-full bg-pink-700"></div>
                <div className="size-4 rounded-full bg-[#E53888]"></div>
            </div>
            {/*content*/}
            <div
                className={`bg-neutral-700 sm:grow ${image ? "object-cover" : "aspect-video"} flex items-center justify-center`}>
                {children}
            </div>
            {/*footer*/}
            <div className="h-6 bg-neutral-800 rounded-b-lg"></div>
        </div>
    )
}


export default Header;

/*
<iframe className="w-full h-full pointer-events-none outline-none"
                                    src="https://www.youtube.com/embed/CgCVZdcKcqY?si=Epufgkk6xdnrlSi2&autoplay=1&mute=1&loop=1&controls=0"
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin">
                            </iframe>
*/

