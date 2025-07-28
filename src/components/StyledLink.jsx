const StyledLink = function ({children, onClick}) {
    return <div
        onClick={onClick}
        className="rounded w-full sm:w-auto bg-white/30 py-2 text-center group sm:p-0 sm:bg-none sm:rounded-none sm:bg-transparent">
        <button
            className="cursor-pointer group-hover:bg-gradient-to-r from-blue-600 to-pink-500 transition-all duration-200
              group-hover:text-transparent bg-clip-text inline-block text-white
              ">
            {children}
        </button>
    </div>
}

export default StyledLink;