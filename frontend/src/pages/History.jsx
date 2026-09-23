import { useState, useEffect } from "react";
import { getHistory } from "../services/dashboardService";

function History() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const result = await getHistory();
                setData(result);
            } catch (err) {
                console.error(err);
                setError("Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div className="dh-page">Loading history...</div>;
    }

    if (error) {
        return <div className="dh-page dh-error">{error}</div>;
    }

    const history = data.history || [];

    const maxScore = history.length > 0
        ? Math.max(...history.map((h) => h.overall_score))
        : 100;

    return (
        <div className="dh-page">
            <h2>Candidate History</h2>

            <div className="dh-stat-grid">
                <div className="dh-stat-card">
                    <h3>Strong Candidates</h3>
                    <p>{data.strong_candidate_count}</p>
                </div>

                <div className="dh-stat-card">
                    <h3>Average Candidates</h3>
                    <p>{data.average_candidate_count}</p>
                </div>
            </div>

            <div className="dh-card">
                <h3>Score Trend</h3>

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "8px",
                        height: "140px",
                        marginTop: "16px",
                    }}
                >
                    {history.map((entry) => (
                        <div
                            key={entry.report_id}
                            title={`${entry.candidate_name}: ${entry.overall_score}`}
                            style={{
                                width: "24px",
                                height: `${(entry.overall_score / maxScore) * 110}px`,
                                background:
                                    entry.recommendation === "Strong Candidate"
                                        ? "var(--color-success)"
                                        : "var(--color-warning)",
                                borderRadius: "4px 4px 0 0",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="dh-card">
                <h3>All Assessments</h3>

                <table className="dh-table">
                    <thead>
                        <tr>
                            <th>Session</th>
                            <th>Candidate</th>
                            <th>Date</th>
                            <th>Overall Score</th>
                            <th>Recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry) => (
                            <tr key={entry.report_id}>
                                <td>#{entry.session_id}</td>
                                <td>{entry.candidate_name}</td>
                                <td>
                                    {entry.created_at
                                        ? new Date(entry.created_at).toLocaleString()
                                        : "N/A"}
                                </td>
                                <td>{entry.overall_score}</td>
                                <td>
                                    <span
                                        className={
                                            entry.recommendation === "Strong Candidate"
                                                ? "dh-badge dh-badge-strong"
                                                : "dh-badge dh-badge-average"
                                        }
                                    >
                                        {entry.recommendation}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {history.length === 0 && <p>No assessments yet.</p>}
            </div>
        </div>
    );
}

export default History;