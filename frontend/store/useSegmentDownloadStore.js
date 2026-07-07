import {create} from "zustand";

const useSegmentDownloadStore = create((set, get) => ({
    downloads :[],
    addDownload: (download) => set((state) => ({downloads: [...state.downloads, download]})),
    removeDownload: (id) => set((state) => ({downloads: state.downloads.filter((d) => d.id !== id)})),
    updateDownload: (id, data) => set((state) => ({
        downloads: state.downloads.map((d) => d.id === id ? {...d, ...data} : d)
    })),
    downloadComplete: (id, processing, downloaded) => set((state) => {
        const updated = state.downloads.map((download) => (
            download.id === id ? {...download, processing, downloaded} : download
        ));
        return {
            downloads: downloaded ? updated.filter((d) => d.id !== id) : updated
        }
    }),
    getTotalDownloads: () => get().downloads.length,
}));

export default useSegmentDownloadStore;