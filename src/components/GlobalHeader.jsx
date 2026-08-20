import {Link} from "react-router";
import StyledLink from "./StyledLink.jsx";
import {IoCloseSharp} from "react-icons/io5";
import {useState} from "react";
import Section from "./Section.jsx";

function GlobalHeader({children}) {

    const [navOpen, setNavOpen] = useState(false);

    return (
        <>
            <div
                className={`fixed overflow-hidden backdrop-blur-lg sm:ring bg-white/10 px-4 max-w-screen-2xl h-screen sm:h-auto w-full sm:w-[calc(100%-4rem)] left-1/2 -translate-x-1/2 sm:top-8 rounded py-3 z-30 scale-y-0 sm:scale-y-100 transition-transform duration-300 ${navOpen ? "scale-y-100 origin-top" : "origin-bottom"}`}>
                <nav className="flex flex-col sm:flex-row items-center justify-between gap-y-10 relative">
                    <h1 onClick={() => {
                        window.scrollTo({ behavior: "smooth", top: 0 });
                        navOpen && setNavOpen(false);
                    }} className="font-semibold text-2xl self-start cursor-pointer"><Link to="/">gravityBlu</Link></h1>
                    <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center gap-x-3 gap-y-2 font-semibold text-lg">

                    </div>
                    <span onClick={() => setNavOpen(false)}
                          className="inline-block p-3 absolute right-0 rounded bg-white/20 cursor-pointer sm:hidden">
                                <IoCloseSharp size={30}/>
                    </span>
                </nav>
            </div>

            <button onClick={() => setNavOpen(prev => !prev)} className="px-4 py-3 rounded sm:hidden flex flex-col gap-1 bg-white/30 fixed right-5 top-5 z-20">
                <div className="h-0.5 w-6 bg-white"></div>
                <div className="h-0.5 w-6 bg-white"></div>
                <div className="h-0.5 w-6 bg-white"></div>
            </button>

            {/*hero-header content here*/}
            <header className="flex items-center justify-center min-h-fit h-fit pt-20 sm:pt-28 px-4 pb-8 sm:px-8 sm:pb-8 bg-gradient-to-br from-violet-950 via-pink-900/80 to-cyan-900/80">
                <Section className="max-w-screen-2xl h-full">
                    {children}
                </Section>
            </header>

        </>
    );
}

export default GlobalHeader;

/*

*/

