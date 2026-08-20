import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import {Outlet} from "react-router";
import GlobalHeader from "./GlobalHeader.jsx";
import GlobalFooter from "./GlobalFooter.jsx";


function AppLayout() {

    return (
        <>
            <Outlet />
        </>
    );
}

export default AppLayout;

/*

*/

