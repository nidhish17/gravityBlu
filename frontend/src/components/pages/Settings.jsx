import {FiFile} from "react-icons/fi";
import usePywebview from "../../hooks/usePywebview.js";
import useSaveLocationStore from "../../hooks/useSaveLocationStore.js";
import toast from "react-hot-toast";
import DefaultVideoQuality from "../DefaultVideoQuality.jsx";
import CheckUpdates from "../CheckUpdates.jsx";
import useAppStore from "../../hooks/useAppStore.js";

const Settings = function () {

    const saveLocation = useSaveLocationStore((state) => state.saveLocation);
    const fetchSaveLocation = useSaveLocationStore((state) => state.fetchSaveLocation);
    const setSaveLocation = useSaveLocationStore((state) => state.setSaveLocation);

    // fetches the location as soon as the component mounts
    usePywebview(fetchSaveLocation);

    const specifyDefaultLocation = async function () {
        const {specifiedLocation, specified, status, error} = await window.pywebview.api.location.specify_location();
        if (specified && status === "success") {
            setSaveLocation(specifiedLocation);
            toast.success("Location saved");
        } else if (status === "cancelled") {
            console.log("display a toast to specify default location");
            toast.error(error);
        } else if (status === "error") {
            console.log(error);
            toast.error("Failed to Specify Location");
        }
    }


    return (
        <div className="flex flex-col gap-y-3 px-2 h-full">
            <h2 className="font-semibold text-xl outline-none text-center">Settings</h2>
            {/*specify save location*/}
            <div className="flex items-center">
                <input type="text"
                       disabled
                       className="px-4 py-3 bg-neutral-900 rounded-l text-sm outline-none ring ring-neutral-900 basis-full"
                       value={saveLocation}
                />
                <button
                    onClick={specifyDefaultLocation}
                    className="px-4 py-3 hover:bg-neutral-700/70 transition-all duration-200 basis-1/5 flex items-center justify-center rounded-r bg-neutral-700 cursor-pointer">
                    <FiFile size={22}/>
                </button>
            </div>

            {/*default video quality selection*/}
            <DefaultVideoQuality />

            <CheckUpdates />

        </div>
    );
}

export default Settings;