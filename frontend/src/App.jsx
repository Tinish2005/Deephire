import { BrowserRouter, Routes, Route, NavLink, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import InterviewFlow from "./pages/InterviewFlow";
import History from "./pages/History";

function App() {
    return (
        <BrowserRouter>
            <header className="app-header slab">
                <Link to="/" className="brand" aria-label="DeepHire home">
                   <svg
    className="brand-mark"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
>
    <defs>
        <linearGradient id="dh-gradient" x1="3" y1="0" x2="33" y2="0">
            <stop offset="0%" stopColor="#22B8FF" />
            <stop offset="100%" stopColor="#873BFF" />
        </linearGradient>
    </defs>

    <path
        d="M5 7 H13 C22 7 22 22 13 22 H5 Z"
        stroke="url(#dh-gradient)"
        strokeWidth="4.5"
        strokeLinejoin="round"
    />

    <path
        d="M24 7 V29 M24 18 H32 M32 7 V29"
        stroke="url(#dh-gradient)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</svg>                    DeepHire
                </Link>
                <nav className="nav" aria-label="Main">
                    <NavLink to="/interview">Assessment</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/history">History</NavLink>
                </nav>
            </header>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/interview" element={<InterviewFlow />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
