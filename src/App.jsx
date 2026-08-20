import AppLayout from "./components/AppLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./components/Home.jsx";
import DownloadSoftware from "./pages/DownloadSoftware.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path={"/download"} element={<DownloadSoftware />} />
                </Route>
                <Route index element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

/*

*/

