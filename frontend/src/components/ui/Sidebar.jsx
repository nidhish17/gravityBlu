import {RxCross1} from "react-icons/rx";
import {FiFile} from "react-icons/fi";
import Settings from "../pages/Settings.jsx";

const Sidebar = function ({closeAside, showAside}) {
    return (
        <>

            <div className={`absolute inset-0 backdrop-blur-lg h-screen transition-transform transform duration-200 
            z-10 origin-left ${showAside ? "scale-x-100 origin-right" : "scale-x-0"}`} onPointerDown={closeAside}>

            </div>


            <aside
                className={`w-sm h-screen absolute right-0 top-0 bg-neutral-800 px-4 py-4 flex flex-col gap-y-2 z-20
            ${showAside ? "translate-x-0" : "translate-x-full"} transition-all duration-200 ${showAside && "shadow-lg shadow-neutral-700/80"}`}>
                <button onClick={closeAside} className="self-end p-2 cursor-pointer ring rounded"><RxCross1 size={22}/></button>
                <hr/>

                <div className="basis-full">
                    <Settings />
                </div>

            </aside>
        </>

    )
}

export default Sidebar;