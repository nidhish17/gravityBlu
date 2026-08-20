import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ErrorBoundary} from "react-error-boundary";
import {Link} from "react-router";

createRoot(document.getElementById('root')).render(
    <ErrorBoundary fallback={<div className="text-center font-semibold text-2xl py-10">Something went terribly wrong! <Link to="/">Go back to Home &larr;</Link></div>}>
        <StrictMode>
            <App />
        </StrictMode>
    </ErrorBoundary>,
)
