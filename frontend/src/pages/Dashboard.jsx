import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/dashboardService";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="dh-page">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="dh-page dh-error">{error}</div>;
    }

    return (
        <div className="dh-page">
            <h2>Dashboard</h2>

            <div className="dh-stat-grid">
                <div className="dh-stat-card">
                    <h3>Total Sessions</h3>
                    <p>{stats.total_sessions}</p>
                </div>

                <div className="dh-stat-card">
                    <h3>Total Reports</h3>
                    <p>{stats.total_reports}</p>
                </div>

                <div className="dh-stat-card">
                    <h3>Average Score</h3>
                    <p>{stats.average_score}</p>
                </div>
            </div>

            <div className="dh-card">
                <h3>Latest Candidate</h3>
                <p>Name: {stats.latest_candidate || "No sessions yet"}</p>
                <p>Score: {stats.latest_score ?? "N/A"}</p>
                <p>Recommendation: {stats.latest_recommendation || "N/A"}</p>
            </div>
        </div>
    );
}

export default Dashboard;