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

    const handleAppUpdate = async function () {
        const data = await window.pywebview.api.updates.update_application();
        console.log(data);
    }

    return (
        <>
            {appUpdateAvailable && (
                <div className="flex items-center justify-center flex-col gap-2 p-4 mt-auto bg-neutral-900 rounded">
                    <p className="">Update Available!</p>
                    <Modal>
                        <Modal.Open windowName="confirmUpdate">
                            <button
                                className="bg-green-500 hover:bg-green-600 shadow-md shadow-lime-700 hover:shadow-lg hover:shadow-lime-400/60 active:shadow-none hover:-translate-y-1.5 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 w-full cursor-pointer transition-all duration-200 rounded font-semibold text-xl py-2 px-4">
                                Update
                            </button>
                        </Modal.Open>

                        <Modal.Window name="confirmUpdate" logo={<UpdateLogo size={18}/>}>
                            <ConfirmDialog handleAppUpdate={handleAppUpdate} />
                        </Modal.Window>
                    </Modal>
                </div>
            )}
        </>
    )
}

const ConfirmDialog = function ({closeModal, handleAppUpdate}) {
    const handleConfirm = function () {
        closeModal();
        handleAppUpdate();
    }
    return (
        <div className="flex flex-col gap-y-2">
            {/*title*/}
            <span className="space-y-0.5">
                <h4 className="capitalize font-semibold">Update app now?</h4>
                <hr/>
            </span>
            <p className="text-gray-300/80">The application will close and restart after update.</p>
            <div className="self-end flex flex-row gap-3 mt-4">
                <button
                    onClick={() => closeModal?.()}
                    className="px-4 py-2 rounded cursor-pointer bg-neutral-500/70 hover:bg-neutral-600 duration-200 transition-all">
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700 transition-all duration-200 cursor-pointer">
                    Confirm
                </button>
            </div>
        </div>
    )

}

const UpdateLogo = ({size}) => (
    <p className="relative before:content-[''] before:absolute before:size-2.5 before:bottom-0 before:right-0 before:translate-x-0.5 before:bg-yellow-500 before:rounded-full">
        <GrUpdate size={size}/>
    </p>
)

export default CheckUpdates;