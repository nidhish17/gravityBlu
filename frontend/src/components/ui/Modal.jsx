import {cloneElement, createContext, useContext, useState} from "react";
import {createPortal} from "react-dom";
import {HiXMark} from "react-icons/hi2";

const ModalContext = createContext(null);


const Modal = function ({children}) {

    const [openWindowName, setOpenWindowName] = useState("");

    const closeModalWindow = () => setOpenWindowName("");
    const openWindow = setOpenWindowName;
    const contextValue = {
        openWindowName,
        closeModalWindow,
        openWindow
    }
    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    );
}

const Open = function ({children, windowName}) {
    const {openWindow} = useContext(ModalContext);
    return cloneElement(children, {onClick: () => openWindow(windowName)});
}

const Window = function ({children, name, logo}) {
    const {openWindowName, closeModalWindow} = useContext(ModalContext);

    if (name !== openWindowName) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/40 z-20 flex items-center justify-center backdrop-blur-sm">
            {/*modal content*/}
            <div className="py-4 px-6 bg-neutral-700 rounded max-w-xl flex flex-col min-w-sm gap-y-1 shadow-xl shadow-stone-800">
                <div className="flex flex-row justify-between items-center">
                    <span className="">{logo}</span>
                    <button onClick={closeModalWindow} className="rounded p-1 hover:bg-stone-600 cursor-pointer self-end transition-colors duration-200"><HiXMark size={22} /></button>
                </div>
                {cloneElement(children, {closeModal: closeModalWindow})}
            </div>
        </div>,
        document.body
    )
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;