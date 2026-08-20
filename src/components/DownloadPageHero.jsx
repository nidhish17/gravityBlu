function DownloadPageHero({version, releaseDate}) {
    return (
        <div className="flex flex-col items-center justify-center gap-y-6 text-center">
            <h1 className="font-black text-3xl sm:text-4xl">Download Latest Version</h1>
            <p className="font-medium text-xl text-white/80">Get the most advanced features</p>
            <div className="flex justify-between gap-4 font-medium">
                <span className="bg-white/20 rounded-full text-sm px-3 py-2">Version {version}</span>
                <span className="bg-white/20 rounded-full text-sm px-3 py-2">{releaseDate}</span>
            </div>
        </div>
    );
}

export default DownloadPageHero;

/*

*/

