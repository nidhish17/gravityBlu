import {FaCaretDown} from "react-icons/fa";
import {TiClipboard} from "react-icons/ti";
import toast from "react-hot-toast";
import {useRef} from "react";

const SearchBar = function ({setDownloadUrl, onSubmit, inputType, inputValue, disabled, setDownloadType, downloadType}) {

    const urlRef = useRef(null);

    const handlePasteBtn = async function () {
        try {
            const text = await navigator.clipboard.readText();
            if (text.includes("https://www.youtube.com") || text.includes("youtu.be")) {
                setDownloadUrl(text);
            } else {
                toast.error("Please enter a valid youtube url")
            }
        } catch (err) {
            toast.error(err.message);
        }
    }


    return (
        <form onSubmit={onSubmit} className="flex flex-row justify-between gap-x-2 w-full rounded outline-2 outline-offset-4 outline-violet-600">
            {/*user enters the url here*/}
            <input ref={urlRef} type={inputType} className="rounded basis-full py-2 px-4 outline-none"
                   placeholder="Paste URL here. (include https://)" onChange={(e) => setDownloadUrl(e.target.value)} value={inputValue}
            />
            {/*clipboard so the user can click and paste the link!*/}
            <button onClick={handlePasteBtn} type="button" className="bg-gray-700 hover:bg-gray-800 transition-colors duration-200 px-2 rounded cursor-pointer"><TiClipboard size={25} /></button>
            {/*user selects audio or video here*/}
            <div className="relative">
                <select disabled={disabled} value={downloadType} onChange={(e) => setDownloadType(e.target.value)} className="text-sm appearance-none h-full rounded block pl-4 pr-8 bg-gray-700 text-neutral-100 outline-none disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default">
                    <option value="video">video</option>
                    <option value="audio">audio</option>
                </select>
                <span className="absolute block right-1 inset- top-1/2 -translate-y-1/2 pointer-events-none"><FaCaretDown size={18} /></span>
            </div>
            {/*user clicks download here*/}
            <button type="submit" disabled={disabled} className="rounded font-semibold text-sm px-4 py-1 bg-violet-600 hover:bg-violet-700/80
            cursor-pointer transition-colors duration-200 disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default">
                Download
            </button>
        </form>
    );
}

export default SearchBar;