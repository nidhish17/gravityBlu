import {create} from "zustand";


const useAppStore = create((setState, getState) => ({
    appUpdateAvailable: false,
    setAppUpdateAvailable: (value) => setState({appUpdateAvailable: value})
}))

export default useAppStore;