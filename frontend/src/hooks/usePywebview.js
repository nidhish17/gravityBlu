import {useEffect} from "react";


const usePywebview = function (callBckFunc) {
    useEffect(() => {

        const wrapper = function () {
            callBckFunc();
        }

        window.addEventListener("pywebviewready", wrapper);
        return () => window.removeEventListener("pywebviewready", wrapper);
    }, []);

}


export default usePywebview;


