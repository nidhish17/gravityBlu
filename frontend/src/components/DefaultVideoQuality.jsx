import {useState} from "react";
import RadioInput from "./ui/RadioInput.jsx";
import useVideoQualityStore from "../hooks/useVideoQualityStore.js";
import toast from "react-hot-toast";
import usePywebview from "../hooks/usePywebview.js";

const DefaultVideoQuality = function () {

    const [updatingDetails, setUpdatingDetails] = useState(false);
    // Ask every time shit
    const askEveryTime = useVideoQualityStore((state) => state.askQualityEveryTime);
    const setAskEveryTime = useVideoQualityStore((state) => state.setAskQualityEveryTime);
    const askQualityEverytime = askEveryTime;

    // This handles AskEveryTime - using optimistic update
    const handleUseDefaultQuality = async function (e) {
        const updatedValue = e.target.checked;
        const prevValue = askQualityEverytime;
        setAskEveryTime(updatedValue);
        try {
            setUpdatingDetails(true);
            // await new Promise(resolve => setTimeout(resolve, 2000));
            const res = await window.pywebview.api.default.update_ask_everytime({"askQualityEverytime": updatedValue});
            console.log(res);
            if (res.ok) {
                toast.success("updated successfully");
            } else {
                toast.error(res?.data?.error);
            }
        } catch (err) {
            toast.error("An error occurred while updating");
            setAskEveryTime(prevValue);
            console.log(err);
        } finally {
            setUpdatingDetails(false);
        }
    }

    // Quality and vcodec selection shit
    const defaultVideoQuality = useVideoQualityStore((state) => state.defaultVideoQuality);
    const setDefaultVideoQuality = useVideoQualityStore((state) => state.setDefaultVideoQuality);

    usePywebview(async () => {
        const res = await window.pywebview.api.default.get_download_preferences();
        if (res.ok) {
            console.log(res.data);
            let {videoQuality, askEveryTime} = res.data;

            switch (videoQuality) {
                case 720:
                    videoQuality = "720p";
                    break;
                case 1080:
                    videoQuality = "1080p";
                    break;
                case 1440:
                    videoQuality = "2k";
                    break;
                case 2160:
                    videoQuality = "4k";
                    break;
                case 4320:
                    videoQuality = "8k";
                    break;
            }
            setDefaultVideoQuality(videoQuality);
            setAskEveryTime(askEveryTime);
        }
    })


    const handleUpdateVideoSettings = async function (e) {
        // send the data to backend on any one of the change
        // even if the askEveryTime is changed then send the form
        // if radio inputs are changed then send it
        let updatedOption = {
            // passing defaultVcodec state for updatedVal instead of setting it to an empty string so as to
            // persist state in database else in database it becomes empty if i don't pass it here!
            videoQuality: {updated: false, prevVal: defaultVideoQuality, updatedVal: defaultVideoQuality}
        };

        // console.log("Form update standby");

        if (e.target.name === "videoQuality") {
            updatedOption.videoQuality.updatedVal = e.target.value;
            updatedOption.videoQuality.updated = true;
            setDefaultVideoQuality(e.target.value);
        }

        const defaultData = {
            "askQualityEveryTime": askEveryTime,
            "defaultVideoQuality": updatedOption.videoQuality.updatedVal,
        }

        try {
            setUpdatingDetails(true);
            const res = await window.pywebview.api.default.update_settings(defaultData);
            console.log(res);
            if (res.ok) {
                toast.success("updated");
            } else {
                toast.error(res.data.error);
                console.log(res.data.details);
            }
        } catch (err) {
            toast.error("Failed to update settings");
            if (updatedOption.videoQuality.updated) {
                setDefaultVideoQuality(updatedOption.videoQuality.prevVal);
            }
        } finally {
            setUpdatingDetails(false);
        }

    }


    return (
        <div className="space-y-2">
            <p className="text-lg font-semibold text-center lowercase">Video quality and Codec</p>
            <hr className="text-gray-500/70"/>
            {/*<AskEveryTime />*/}

            <form onChange={handleUpdateVideoSettings}
                  className={`${askQualityEverytime && "opacity-50 text-gray-600 pointer-events-none"} 
                  flex flex-col gap-y-3 ${updatingDetails && "pointer-events-none animate-pulse"}`}
            >
                <div className="flex flex-col gap-y-6">
                    <div className="space-y-1">
                        <h3 className="font-semibold capitalize">quality</h3>
                        <div className="grid grid-cols-3 items-center gap-3 place-items-start">
                            {["8k", "4k", "2k", "1080p", "720p"].map((quality, i) => {
                                return <RadioInput
                                    key={i}
                                    id={quality}
                                    name="videoQuality"
                                    value={quality}
                                    label={quality}
                                    checked={quality === defaultVideoQuality}
                                />
                            })}
                        </div>
                        <p className="info text-sm text-stone-600/90">if preferred video quality isn't available, next
                            best is picked instead.</p>
                    </div>
                </div>

            </form>
        </div>
    );
}


const AskEveryTime = function ({askEveryTime, handleUseDefaultQuality}) {
    return (
        <div className="flex flex-col gap-y-4">
            <div
                className="flex items-center justify-between bg-gray-800 rounded ring ring-gray-900 py-2 px-4 hover:bg-gray-800/80 transition-colors">
                <p className="font-semibold">Ask every time</p>
                <input type="checkbox"
                       checked={askEveryTime}
                       onChange={handleUseDefaultQuality}
                       disabled={true}
                       className="appearance-none w-10 h-5 bg-gray-700 rounded-full checked:bg-violet-600 relative
                           after:content-[''] after:size-5 after:rounded-full after:bg-white after:absolute
                           after:-translate-y-1/2 after:top-1/2 checked:after:translate-x-5 disabled:opacity-70 disabled:cursor-not-allowed
                           transition-all duration-200 after:transition-transform after:duration-200 cursor-pointer outline-1 outline-offset-2"/>
            </div>
        </div>
    )
}


export default DefaultVideoQuality;


// onChange={(selectedVcodec) => setDefaultVcodec(selectedVcodec)}
// onChange={(quality) => setDefaultVideoQuality(quality)}