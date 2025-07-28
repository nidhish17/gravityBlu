import Section from "../components/Section.jsx";
import {FaArrowDown, FaWindows} from "react-icons/fa";
import windows from "../assets/windows.jpg"
import randImg from "../assets/blackpink-rose-pink-venom-mv-4k-wallpaper-uhdpaper.com-91@1@i.jpg"
import {PiWindowsLogo, PiWindowsLogoFill} from "react-icons/pi";
import appIcon from "../assets/icon.png"
import finishedPage from "../assets/app_scs/Screenshot 2025-07-26 20-23-53.png"

function Download({ref}) {
    const userMachineIsWin = navigator.userAgent.includes("Windows");
    return (
        <Section ref={ref} id="download" className="relative">
            <div className="space-y-6">
                <h1 className="font-bold text-3xl sm:text-4xl uppercase tracking-tighter">Download</h1>
                {/*bg-gradient-to-tr from-purple-700/70 via-violet-800/40 to-rose-500/70*/}
                <div
                    className="relative flex flex-col-reverse md:flex-row justify-between gap-x-8 gap-y-6 p-4 sm:p-10 rounded bg-white/10 backdrop-blur-lg">
                    <div
                        className="flex flex-col items-center md:items-start justify-betwee gap-y-2 md:gap-y-6 basis-1/2">
                        <div className="flex flex-co items-center gap-3">
                            <img src={appIcon} alt="app icon" className="size-25 md:size-40" />
                            <h3 className="font-semibold text-lg md:text-3xl z-20">Download for windows!</h3>
                            {/*<FaWindows className="md:block hidden self-en opacity-90 scale-x-[-1 z-10" size={200} />*/}
                        </div>
                        <a
                            href={userMachineIsWin ? `https://github.com/nidhish17/gravityBlu/releases/download/2.0.0/GravityBlu.msi` : undefined}
                            download
                            target={"_blank"}
                            className={`${userMachineIsWin ? "bg-gradient-to-br" : "bg-stone-600 pointer-events-none"} group cursor-pointer bg-size-[200%_200%] bg-position-[0%_0%] hover:bg-position-[100%_100%] uppercase w-full sm:w-auto flex items-center justify-center gap-x-2  to-indigo-900 via-violet-950 from-rose-950 transition-all duration-500 px-8 py-3 rounded-full hover:-translate-y-0.5 transform text-lg font-semibold shadow-2xl hover:shadow-rose-900/70`}>
                            <span className="">
                                <PiWindowsLogoFill size={25} className="block" />
                            </span>
                            {/*{navigator.userAgent.includes("Windows") ? }*/}
                            {userMachineIsWin ? <><span>Download </span><span className="normal-case">gravityBlu</span></> : <span className="text-sm">available on windows</span>}
                            <span className="">
                                <FaArrowDown size={18} className="animate-bounc group-hover:translate-y-[2.5px] transition-transform"/>
                            </span>
                        </a>
                    </div>

                    <div className="basis-8/12 overflow-hidden rounded-lg">
                        <img src={finishedPage} alt="download img" className="rounded-lg h-full object-cover hover:scale-125 transition-all duration-200" />
                    </div>

                    <div className="absolute inset-0 -z-10 bg-cover bg-no-repeat opacity-10" style={{backgroundImage: `url(${windows})`}}></div>
                </div>

            </div>
            {/*radial gradient*/}
            <div className="absolute top-0 inset-x-0 bg-radial from-cyan-500/50  via-cyan-700/50 to-cyan-950/60 animate-pulse-slow -z-10 blur-3xl rounded-b-4xl h-8/12"></div>
        </Section>
    );
}

export default Download;

/*

*/

