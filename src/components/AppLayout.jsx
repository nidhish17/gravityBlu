import Header from "./Header.jsx";
import Features from "../pages/Features.jsx";
import Download from "../pages/Download.jsx";
import About from "../pages/About.jsx";
import React, {createContext, useRef} from "react";
import Footer from "./Footer.jsx";

export const RefContext = createContext(null);

function AppLayout() {
    const downloadRef = useRef(null);
    const aboutRef = useRef(null);
    const featureRef = useRef(null);
    const refValue = {
        downloadRef,
        aboutRef,
        featureRef,
    }
    return (
        <>
            <RefContext.Provider value={refValue}>
                <Header />
                <main className="max-w-screen-2xl mx-auto">
                    <Features ref={featureRef} />
                    <Download ref={downloadRef} />
                    <About ref={aboutRef} />
                </main>
                <Footer />
            </RefContext.Provider>
        </>
    );
}

export default AppLayout;

/*

*/

