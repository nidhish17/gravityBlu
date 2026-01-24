const SegmentControls = function ({clearSegments}) {

    return (
        <div className={`borde`}>
            <div className="flex justify-between items-center gap-4">

                <div className="ring-2 ring-gray-700 flex items-center justify-center p-1 rounded-md basis-full gap-3">
                    <input type="text" className="px-4 py-2 rounded outline-none font-semibold w-full"
                           placeholder="HH:MM:SS"/>
                    <button
                        className="px-4 py-2 rounded ring-2 ring-gray-600 hover:bg-gray-600 transition-colors cursor-pointer">
                        Jump
                    </button>
                </div>

                <button
                    onClick={clearSegments}
                    className="ring-2 px-4 py-2 rounded-md hover:bg-white/80 text-black transition-all duration-200 bg-white
                     cursor-pointer font-semibold basis-1/6 ring-offset-4 ring-offset-neutral-900 ring-white hover:ring-offset-0">
                    Clear Segments
                </button>
            </div>
        </div>
    )
}

export default SegmentControls;