import {IoVideocamOutline} from "react-icons/io5";
import {IoMdCut} from "react-icons/io";
import {motion} from "framer-motion";


const DownloadModeSelector = function ({setDownloadMode, downloadMode}) {
    return (
        <motion.div
            initial={{opacity: 0, scale:  0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.2}}
        >
        <div className="ring-2 ring-gray-700 p-1 rounded-md bg-gray-900  text-lg transition-all duration-200">
            <div className="flex gap-x-2">
                <div className="">
                    <input onChange={() => setDownloadMode("full")} id="full-video" type="radio" className={`appearance-none peer`} value="full" checked={downloadMode==="full"} />
                    <label htmlFor="full-video" className="px-6 py-2 rounded peer-checked:bg-gray-700 inline-block text-gray-400 hover:text-white peer-checked:text-sky-600 peer-checked:hover:text-sky-600 transition-all duration-200">
                        <span className="flex items-center justify-center gap-2">
                            <IoVideocamOutline size={30} />
                            Full Video
                        </span>
                    </label>
                </div>

                <div className="">
                    <input onChange={() => setDownloadMode("segments")} id="segments" type="radio" className={`appearance-none peer`} value="segments" checked={downloadMode==="segments"} />
                    <label htmlFor="segments" className="px-6 py-2 rounded peer-checked:bg-gray-700 inline-block text-gray-400 hover:text-white peer-checked:text-pink-500 peer-checked:hover:text-pink-500 transition-all duration-200">
                        <span className="flex items-center justify-center gap-2">
                            <IoMdCut size={25} />
                            Segments
                        </span>
                    </label>
                </div>
            </div>
        </div>
        </motion.div>
    );
}

export default DownloadModeSelector;