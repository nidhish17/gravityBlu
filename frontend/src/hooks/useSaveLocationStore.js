import {create} from "zustand";


const useSaveLocationStore = create((setState) => ({
    saveLocation: "",
    setSaveLocation: (location) => setState({saveLocation: location}),

    fetchSaveLocation: async () => {
        try {
            const data = await window.pywebview.api.location.get_user_save_loc();
            if (data.specified) {
                setState({saveLocation: data.specifiedLocation});
            }
        } catch (err) {
            console.warn("failed to fetch save location", err);
        }
    }

}));

export default useSaveLocationStore;
