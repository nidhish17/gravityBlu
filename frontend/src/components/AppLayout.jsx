import Navbar from "./ui/Navbar.jsx";
import {Toaster} from "react-hot-toast";
import Downloader from "./Downloader.jsx";
import {Tooltip} from "react-tooltip";
import {useState} from "react";


const AppLayout = function () {

    const [page, setPage] = useState("download");


    return (
        <>

            <main className="h-screen min-h-screen flex flex-row-reverse">
                <Navbar page={page} setPage={setPage} />

                <div className="flex-1 overflow-y-scroll no-scrollbar h-full">
                    <Downloader page={page} setPage={setPage} />
                </div>

            </main>


            <Toaster position={"bottom-right"} toastOptions={{
                duration: 1000,
                success: {
                    duration: 1500,
                },
            }}/>

            <Tooltip id="tip"/>
        </>
    );
}

export default AppLayout;