import {create} from "zustand";


const useDownloadStore = create((setState, getState) => ({
    downloads: [],
    setDownloads: (newDownload) => setState((state) => ({downloads: [newDownload, ...state.downloads]})),
    updateDownloadProgress: (downloadId, data) => setState((state) => {
        return {downloads: state.downloads.map((d) => d.id === downloadId ? {...d, progress: data.progress, ...data} : d)}
    }),
    downloadComplete: (id, processing, downloaded) => setState((state) => {
        const updated = state.downloads.map((download) => (
            download.id === id ? {...download, processing, downloaded} : download
        ));
        return {
            downloads: downloaded ? updated.filter((d) => d.id !== id) : updated
        }
    }),
    getTotalDownloading: () => getState().downloads.length,
}));



export default useDownloadStore;