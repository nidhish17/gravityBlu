function FeatureCard({imgLink, description, cover=false}) {
    return (
        <div className="flex flex-col bg-neutral-900 rounded-lg hover:-translate-y-5 hover:will-change-transform transition-all duration-500">
            {/*image*/}
            <div className="aspect-[1280/720] rounded-t-lg overflow-hidden">
                <img src={imgLink} alt="" className={`size-full object-contain ${cover && "object-cover"}`} />
            </div>
            {/*description*/}
            <hr/>
            <div className="py-3">
                <h3 className="text-center text-white/60 capitalize">{description}</h3>
            </div>
        </div>
    );
}

export default FeatureCard;

/*

*/

