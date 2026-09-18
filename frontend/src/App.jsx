import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import FusionTester from "./components/FusionTester";
import Dashboard from "./pages/Dashboard";

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
                <Link to="/">Assessment</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>

            <Routes>
                <Route path="/" element={<FusionTester />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;