import Navbar from "./ui/Navbar.jsx";
import {Toaster} from "react-hot-toast";
import Downloader from "./Downloader.jsx";
import {Tooltip} from "react-tooltip";


const AppLayout = function () {

    return (
        <>

            <main className="h-screen min-h-screen flex flex-col">
                <Navbar/>

                <Downloader />

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