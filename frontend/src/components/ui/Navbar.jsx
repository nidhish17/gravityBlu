import {createContext, useState} from "react";
import Sidebar from "./Sidebar.jsx";
import {AiOutlineSetting} from "react-icons/ai";
import useAppStore from "../../hooks/useAppStore.js";
import {createPortal} from "react-dom";
import {GrUpdate} from "react-icons/gr";
import {MdClose} from "react-icons/md";

export const SidebarContext = createContext(null);

const Navbar = function () {
    const [showAside, setShowAside] = useState(false);
    const appUpdateAvailable = useAppStore(state => state.appUpdateAvailable);

    return (
        <header className="px-8 py-6 bg-neutral-800/95 ">
            <nav className="flex justify-between items-center">
                <ul className="*:hover:text-amber-100 *:transition-colors *:cursor-pointer text-lg">
                    <li className="font-bold">Youtube Video</li>
                </ul>
                <button onClick={() => setShowAside((show) => !show)}
                        className={`hover:text-amber-100 transition-colors duration-200 cursor-pointer 
                        ${appUpdateAvailable &&
                        "relative before:content-[''] before:size-2.5 before:rounded-full before:bg-yellow-500 before:absolute before:top-0 before:right-1 before:translate-x-[5px] before:shadow-md before:shadow-yellow-500"}`}
                        {...(appUpdateAvailable && {
                            "data-tooltip-id": "tip",
                            "data-tooltip-content": "Update Available!"
                        })}
                >
                    <AiOutlineSetting size={25}/>
                </button>
            </nav>
            {appUpdateAvailable && <UpdateAvailablePortal setShowAside={setShowAside} />}
            <SidebarContext.Provider value={{setShowAside}}>
                <Sidebar showAside={showAside} closeAside={() => setShowAside(false)}/>
            </SidebarContext.Provider>
        </header>
    );
}

const UpdateAvailablePortal = function ({setShowAside}) {
    const [showMessage, setShowMessage] = useState(true);

    if (!showMessage) return null;

    return createPortal(
        <div onClick={() => {
            setShowAside(true);
            setShowMessage(false);
        }} className="fixed cursor-pointer bottom-6 right-6 z-20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-2 rounded-full">
            <div className="flex items-center gap-x-1.5 justify-center">
                <p className="relative before:content-[''] before:absolute before:size-2.5 before:bottom-0 before:right-0 before:translate-x-0.5 before:bg-yellow-500 before:rounded-full"><GrUpdate size={18} /></p>
                <p className="">New Update Available!</p>
                <button className="cursor-pointer border rounded-full" onClick={(e) => {
                    e.stopPropagation();
                    setShowMessage(false);
                }}><MdClose size={20} /></button>
            </div>

        </div>,
        document.body
    );
}


export default Navbar;