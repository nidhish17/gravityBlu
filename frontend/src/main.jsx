import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ErrorBoundary} from "react-error-boundary";

createRoot(document.getElementById('root')).render(
    <ErrorBoundary fallback={<div className="font-black text-2xl py-10">Something went terribly wrong! <p className="text-xl font-medium opacity-80">restarting app might fix it</p></div>}>
        <StrictMode>
            <App/>
        </StrictMode>
    </ErrorBoundary>,
)
