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
                    <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
                    DeepHire
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
