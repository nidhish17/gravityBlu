import appLogo from "../assets/icon.png"
import {AiFillGithub} from "react-icons/ai";
import {MdArrowOutward} from "react-icons/md";
import {useContext} from "react";
import {RefContext} from "./AppLayout.jsx";

function Footer() {
    const {downloadRef, aboutRef, featureRef} = useContext(RefContext);

    return (
        <footer className="p-4 sm:p-8 md:p-12 lg:p-16 gap-6 bg-neutral-900 flex flex-col sm:flex-row">
            <figure className="basis-[200px] self-center sm:self-start">
                <img src={appLogo} alt="app logo" className="w-30"/>
            </figure>
            <div className="flex flex-col sm:flex-row justify-between gap-8 basis-full">
                {/*project repo*/}
                <div className="flex flex-col gap-y-4 text-center">
                    <h3 className="text-xl font-semibold">GitHub</h3>
                    <a href="https://github.com/nidhish17/gravityBlu" target={"_blank"}
                       className="justify-center bg-blue-950 px-6 py-2 font-semibold rounded flex gap-2 items-center hover:bg-blue-900/90 transition-colors duration-500">
                        <span><AiFillGithub size={25}/></span>
                        <span className="">Project Repo</span>
                        <span className=""><MdArrowOutward size={20}/></span>
                    </a>
                </div>
                {/*pages*/}
                <div className="flex flex-col items-center gap-y-4">
                    <h3 className="text-xl font-semibold">Sections</h3>
                    <div className="text-stone-400 text-lg flex flex-col">
                        <button onClick={() => {
                            window.scrollTo({behavior: "smooth", top: 0});
                        }} className="">
                            Home
                        </button>
                        <button onClick={() => {
                            featureRef.current?.scrollIntoView({behavior: "smooth"});
                        }} className="">
                            Features
                        </button>
                        <button onClick={() => {
                            downloadRef.current?.scrollIntoView({behavior: "smooth"});
                        }} className="">
                            Download
                        </button>
                        <button onClick={() => {
                            aboutRef.current?.scrollIntoView({behavior: "smooth"});
                        }} className="">
                            About
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-y-4">
                    <h3 className="text-xl font-semibold">gravityBlu</h3>
                    <div className="items-center flex flex-col gap-y-1">
                        <a href="https://github.com/nidhish17/gravityBlu/issues" target="_blank" className="text-stone-400 flex items-center hover:underline underline-offset-2 decoration-stone-500">
                            <span className="">Report an issue</span>
                            <span className=""><MdArrowOutward /></span>
                        </a>

                        <a href="mailto:nidhish1233@gmail.com" target="_blank" className="text-stone-400 flex items-center hover:underline underline-offset-2 decoration-stone-500">
                            <span className="">Email me</span>
                            <span className=""><MdArrowOutward /></span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

/*

*/

