import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import FusionTester from "./components/FusionTester";
import Dashboard from "./pages/Dashboard";
import InterviewFlow from "./pages/InterviewFlow";
import History from "./pages/History";

function App() {
    return (
        <BrowserRouter>
            <nav className="dh-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Assessment (Old Test)
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/interview"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    Start Interview
                </NavLink>
                <NavLink
                    to="/history"
                    className={({ isActive }) => (isActive ? "active" : "")}
                >
                    History
                </NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<FusionTester />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interview" element={<InterviewFlow />} />
                <Route path="/history" element={<History />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;