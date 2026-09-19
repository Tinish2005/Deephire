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
        return <p style={{ padding: "20px" }}>Loading history...</p>;
    }

    if (error) {
        return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
    }

    const history = data.history || [];

    const maxScore = history.length > 0
        ? Math.max(...history.map((h) => h.overall_score))
        : 100;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Candidate History</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "15px",
                    marginBottom: "25px",
                }}
            >
                <div
                    style={{
                        padding: "15px 20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                    }}
                >
                    <strong>Strong Candidates:</strong>{" "}
                    {data.strong_candidate_count}
                </div>

                <div
                    style={{
                        padding: "15px 20px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                    }}
                >
                    <strong>Average Candidates:</strong>{" "}
                    {data.average_candidate_count}
                </div>
            </div>

            <h3>Score Trend</h3>

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                    height: "150px",
                    marginBottom: "30px",
                    borderBottom: "1px solid #ccc",
                    padding: "10px",
                }}
            >
                {history.map((entry) => (
                    <div
                        key={entry.report_id}
                        title={`${entry.candidate_name}: ${entry.overall_score}`}
                        style={{
                            width: "24px",
                            height: `${(entry.overall_score / maxScore) * 120}px`,
                            background:
                                entry.recommendation === "Strong Candidate"
                                    ? "#4caf50"
                                    : "#ffa726",
                            borderRadius: "3px 3px 0 0",
                        }}
                    />
                ))}
            </div>

            <h3>All Assessments</h3>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                }}
            >
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
                        <th style={{ padding: "8px" }}>Session</th>
                        <th style={{ padding: "8px" }}>Candidate</th>
                        <th style={{ padding: "8px" }}>Date</th>
                        <th style={{ padding: "8px" }}>Overall Score</th>
                        <th style={{ padding: "8px" }}>Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry) => (
                        <tr
                            key={entry.report_id}
                            style={{ borderBottom: "1px solid #eee" }}
                        >
                            <td style={{ padding: "8px" }}>
                                #{entry.session_id}
                            </td>
                            <td style={{ padding: "8px" }}>
                                {entry.candidate_name}
                            </td>
                            <td style={{ padding: "8px" }}>
                                {entry.created_at
                                    ? new Date(entry.created_at).toLocaleString()
                                    : "N/A"}
                            </td>
                            <td style={{ padding: "8px" }}>
                                {entry.overall_score}
                            </td>
                            <td style={{ padding: "8px" }}>
                                {entry.recommendation}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {history.length === 0 && (
                <p>No assessments yet.</p>
            )}
        </div>
    );
}

export default History;