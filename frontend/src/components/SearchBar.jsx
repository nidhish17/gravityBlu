const SearchBar = function ({onChange, onSubmit, inputType, inputValue, disabled, children}) {
    return (
        <form onSubmit={onSubmit} className="flex flex-row justify-between gap-x-2 w-full rounded outline-2 outline-offset-4 outline-violet-600">
            <input type={inputType} className="rounded basis-full py-2 px-4 outline-none"
                   placeholder="Paste URL here." onChange={onChange} value={inputValue}
            />
            {children}
            <button type="submit" disabled={disabled} className="rounded font-semibold text-sm px-4 py-1 bg-violet-600 hover:bg-violet-700/80
            cursor-pointer transition-colors duration-200 disabled:animate-pulse disabled:bg-stone-500/80 disabled:pointer-events-none disabled:cursor-default">
                Download
            </button>
        </form>
    );
}

export default SearchBar;