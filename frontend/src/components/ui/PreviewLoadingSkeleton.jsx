const PreviewLoadingSkeleton = function () {
    return (
        <>
      {/* Mode Toggle Skeleton */}
      <div className="ring-2 ring-gray-700 p-1 rounded-md bg-gray-900">
        <div className="flex gap-x-2">
          <div className="h-10 w-40 rounded bg-gray-700/60 animate-pulse" />
          <div className="h-10 w-40 rounded bg-gray-700/60 animate-pulse" />
        </div>
      </div>

      {/* Main Container Skeleton */}
      <div className="ring ring-gray-700 bg-gray-800 w-full rounded flex flex-col items-center justify-center gap-y-6 p-4 py-12 mt-6">

        {/* Center Icon */}
        <div className="size-20 rounded-full bg-gray-700/60 animate-pulse" />

        {/* Heading */}
        <div className="h-5 w-64 rounded bg-gray-700/60 animate-pulse" />

        {/* Card */}
        <div className="ring-2 ring-gray-700 ring-offset-4 ring-offset-gray-800 rounded flex gap-4 w-3xl p-4 bg-gray-900">

          {/* Thumbnail */}
          <div className="basis-2/3 relative">
            <div className="h-40 w-full rounded-md bg-gray-700/60 animate-pulse" />
            <div className="absolute bottom-1 right-1 h-5 w-14 rounded bg-gray-700/70 animate-pulse" />
          </div>

          {/* Right Side */}
          <div className="basis-full space-y-6">

            {/* Info Pills */}
            <div className="flex gap-2">
              <div className="h-8 w-28 rounded bg-gray-700/60 animate-pulse" />
              <div className="h-8 w-32 rounded bg-gray-700/60 animate-pulse" />
              <div className="h-8 w-24 rounded bg-gray-700/60 animate-pulse" />
            </div>

            {/* Video Title */}
            <div className="h-10 w-full rounded bg-gray-700/60 animate-pulse" />
          </div>
        </div>
      </div>
    </>
    );
}

export default PreviewLoadingSkeleton;