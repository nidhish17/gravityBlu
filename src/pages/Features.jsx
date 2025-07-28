import Section from "../components/Section.jsx";
import FeatureCard from "../components/FeatureCard.jsx";
import highRes from "../assets/app_scs/Screenshot 2025-07-26 20-23-57.png"
import parallelDownloads from "../assets/app_scs/Screenshot 2025-07-26 20-24-32.png"
import intutiveUI from "../assets/app_scs/Screenshot 2025-07-26 20-23-44.png"

function Features({...props}) {
    return (
        <Section {...props} className="borde">
            <div className="space-y-6">
                {/*feature heading*/}
                <h1 className="font-bold text-3xl sm:text-4xl uppercase tracking-tighter">Features</h1>
                <div className="flex flex-col gap-y-12">
                    <div className="flex flex-col-reverse text-center gap-y-6 sm:flex-row sm:text-start gap-x-4">
                        {/*details*/}
                        <div className="basis-1/2 space-y-1.5">
                            <p className="text-white/70 text-sm sm:text-lg">Download 2k, 4k, 8k videos for free</p>
                            <p className="text-white/50 text-xs sm:text-lg font-mono">We offer free downloads for all the resolutions no subscription needed.</p>
                        </div>
                        {/*the image*/}
                        <div className="relative ring basis-full aspect-video overflow-hidden">
                            <img src="https://images.pexels.com/photos/1707213/pexels-photo-1707213.jpeg" alt="video resolution demonstration" className="scale-x-[-1] object-cover size-full" />
                            <div className="absolute after:content-['2K'] after:absolute after:bottom-4 after:text-4xl after:font-bold after:left-1/2 after:-translate-x-1/2 bg-black/30 backdrop-blur-[6px] w-1/3 inset-y-0 border-r"></div>
                            <div className="absolute after:content-['4K'] after:absolute after:bottom-4 after:text-4xl after:font-bold after:left-1/2 after:-translate-x-1/2 bg-black/30 backdrop-blur-[3px] w-1/3 inset-y-0 translate-x-full border-r"></div>
                            <div className="absolute after:content-['8K'] after:absolute after:bottom-4 after:text-4xl after:font-bold after:left-1/2 after:-translate-x-1/2 bg-black/30 backdrop-blur-[0px] w-1/3 inset-y-0 right-0"></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-5 *:basis-[300px] *:grow backface-hidden">
                        {/*<FeatureCard description="parallel downloads" imgLink="https://images.pexels.com/photos/4786964/pexels-photo-4786964.jpeg" />*/}
                        <FeatureCard description="parallel downloads" cover imgLink={parallelDownloads} />
                        <FeatureCard description="higher resolution support" cover imgLink={highRes} />
                        <FeatureCard description="auto updates" imgLink={intutiveUI} cover />
                    </div>
                </div>
            </div>
        </Section>
    );
}

export default Features;

/*
    - fast parallel downloads
    - auto update
    - download 2k, 4k, 8k
    -
*/

