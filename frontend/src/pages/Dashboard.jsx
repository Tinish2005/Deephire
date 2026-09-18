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
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Dashboard</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "20px",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        minWidth: "180px",
                    }}
                >
                    <h3>Total Sessions</h3>
                    <p style={{ fontSize: "28px" }}>
                        {stats.total_sessions}
                    </p>
                </div>

                <div
                    style={{
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        minWidth: "180px",
                    }}
                >
                    <h3>Total Reports</h3>
                    <p style={{ fontSize: "28px" }}>
                        {stats.total_reports}
                    </p>
                </div>

                <div
                    style={{
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        minWidth: "180px",
                    }}
                >
                    <h3>Average Score</h3>
                    <p style={{ fontSize: "28px" }}>
                        {stats.average_score}
                    </p>
                </div>
            </div>

            <hr style={{ margin: "30px 0" }} />

            <h3>Latest Candidate</h3>
            <p>
                Name: {stats.latest_candidate || "No sessions yet"}
            </p>
            <p>
                Score: {stats.latest_score ?? "N/A"}
            </p>
            <p>
                Recommendation: {stats.latest_recommendation || "N/A"}
            </p>
        </div>
    );
}

export default Dashboard;