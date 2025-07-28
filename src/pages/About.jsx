import Section from "../components/Section.jsx";
import {RiTailwindCssFill} from "react-icons/ri";
import {FaPython, FaReact} from "react-icons/fa";
import ytDlp from "../assets/b6a8d716-9c7b-40ec-bc44-6422d8b741a0.png"
import pywebLogo from "../assets/logo-no-text.png"
import PYI from "../assets/pyinstaller-draft1a.ico"
import {MdArrowOutward} from "react-icons/md";

function About({...props}) {
    return (
        <Section {...props}>
            <div className="space-y-6">
                <h1 className="font-bold text-3xl sm:text-4xl uppercase tracking-tighter">About</h1>

                <div className="text-lg flex flex-col gap-y-4 items-start">
                    <p className="text-lg text-white/80">A simple youtube downloader GUI made using <a href="https://pypi.org/project/yt-dlp/" className="text-blue-500" target="_blank">yt-dlp </a>
                        and <a href="https://pypi.org/project/pywebview/" className="text-blue-500" target="_blank">pywebview</a>
                    </p>
                    <a href="https://github.com/nidhish17/gravityBlu" target={"_blank"} className="text-yellow-500 hover:underline underline-offset-2 decoration-amber-500 flex items-center">Project Repository <span className=""><MdArrowOutward size={20} /></span></a>
                </div>

                <div className="flex flex-col gap-y-3">

                    <h2 className="">Built Using</h2>

                    <div className="flex flex-wrap gap-3 *:grow *:basis-[140px] sm:*:basis-[200px] text-lg sm:text-xl capitalize *:pointer-events-none">
                        <div className="border flex items-center flex-col">
                            <RiTailwindCssFill className="text-cyan-400 size-full" />
                            <hr className="w-full"/>
                            <p>tailwind css</p>
                        </div>

                        <div className="border flex items-center flex-col">
                            <FaReact className="text-cyan-600 size-full" />
                            <hr className="w-full"/>
                            <p>React</p>
                        </div>

                        <div className="border flex items-center flex-col">
                            <img src={ytDlp} alt="yt-dlp logo" className=" size-full object-contain" />
                            <hr className="w-full"/>
                            <p>YT-DLP</p>
                        </div>

                        <div className="border flex items-center flex-col">
                            <img src={pywebLogo} alt="pywebview logo" className="size-full object-contain"/>
                            <hr className="w-full"/>
                            <p>Pywebview</p>
                        </div>

                        <div className="border flex items-center flex-col">
                            <FaPython className="text-yellow-500 size-full" />
                            <hr className="w-full"/>
                            <p>python</p>
                        </div>

                        <div className="border flex items-center flex-col">
                            <img src={PYI} alt="pywebview logo" className="size-full object-contain max-w-50" />
                            <hr className="w-full"/>
                            <p>PyInstaller</p>
                        </div>
                    </div>

                </div>

            </div>
        </Section>

    );
}

export default About;

/*

*/

