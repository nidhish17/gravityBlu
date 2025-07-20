import {create} from "zustand";

const useVideoQualityStore = create(setState => ({
    // this is the one that user selects if the user wants to be prompted to select quality and codec everytime
    // if this is true then we'll take the default quality and code and send it to the backend without prompting
    // the user to select the quality and codec everytime
    askQualityEveryTime: true,
    setAskQualityEveryTime: (use) => setState({askQualityEveryTime: use}),

    defaultVideoQuality: "1080p",
    setDefaultVideoQuality: (quality) => setState({defaultVideoQuality: quality}),
}));


export default useVideoQualityStore;
