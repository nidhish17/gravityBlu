import Features from "../pages/Features.jsx";
import Download from "../pages/Download.jsx";
import About from "../pages/About.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";


function Home() {
    return (
        <>
            <Header />
            <main className="max-w-screen-2xl mx-auto">
                <Features />
                <Download />
                <About />
            </main>
            <Footer />
        </>
    );
}

export default Home;

/*

*/

