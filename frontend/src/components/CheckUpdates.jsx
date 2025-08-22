import usePywebview from "../hooks/usePywebview.js";
import useAppStore from "../hooks/useAppStore.js";
import Modal from "./ui/Modal.jsx";
import {GrUpdate} from "react-icons/gr";

const CheckUpdates = function () {
    const appUpdateAvailable = useAppStore(state => state.appUpdateAvailable);
    const setAppUpdateAvailable = useAppStore(state => state.setAppUpdateAvailable);

    usePywebview(async () => {
        const data = await window.pywebview.api.updates.check_for_updates();
        const {currentVersion, latestVersion, updateAvailable} = data.details;
        setAppUpdateAvailable(updateAvailable);
    })

    const handleOpenUpdateWebsite = async function () {
        const data = await window.pywebview.api.updates.open_update_website();
        console.log(data);
    }

    return (
        <>
            {appUpdateAvailable && (
                <div className="flex items-center justify-center flex-col gap-2 p-4 mt-auto bg-neutral-900 rounded">
                    <p className="">Update Available!</p>
                        <button onClick={handleOpenUpdateWebsite} className="bg-green-500 hover:bg-green-600 shadow-md shadow-lime-700 hover:shadow-lg hover:shadow-lime-400/60 active:shadow-none hover:-translate-y-1.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 w-full cursor-pointer transition-all duration-200 rounded font-semibold text-xl py-2 px-4">
                            Download Update!
                        </button>
                </div>
            )}
        </>
    )
}

const UpdateLogo = ({size}) => (
    <p className="relative before:content-[''] before:absolute before:size-2.5 before:bottom-0 before:right-0 before:translate-x-0.5 before:bg-yellow-500 before:rounded-full">
        <GrUpdate size={size}/>
    </p>
)

export default CheckUpdates;