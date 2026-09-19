import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FusionTester from "./components/FusionTester";
import Dashboard from "./pages/Dashboard";
import InterviewFlow from "./pages/InterviewFlow";
import History from "./pages/History";

function App() {
    return (
        <BrowserRouter>
            <nav
                style={{
                    padding: "15px",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    gap: "20px",
                }}
            >
                <Link to="/">Assessment (Old Test)</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/interview">Start Interview</Link>
                <Link to="/history">History</Link>
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