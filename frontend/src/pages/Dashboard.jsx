import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/dashboardService";
import { ScoreRing } from "../components/ui";
import { fmt, isStrong, num } from "../lib/signals";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setStats(await getDashboardStats());
            } catch (err) {
                console.error(err);
                setError("Could not load dashboard stats. Check that the backend is running.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <main className="page">
            <div className="page-head">
                <h2>Dashboard</h2>
                <p>Live totals across every assessment run on this platform.</p>
            </div>

            {loading && <div className="panel"><div className="skeleton" style={{ width: "50%" }} /><div className="skeleton" style={{ width: "80%" }} /></div>}
            {error && <p className="msg msg-err" role="alert">{error}</p>}

            {stats && (
                <>
                    <dl className="readout slab">
                        <div><dt>Sessions</dt><dd>{fmt(stats.total_sessions)}</dd></div>
                        <div><dt>Reports</dt><dd>{fmt(stats.total_reports)}</dd></div>
                        <div><dt>Average score</dt><dd>{fmt(stats.average_score, 1)}</dd></div>
                    </dl>

                    <section className="panel" style={{ marginTop: 16 }}>
                        <h3>Latest candidate</h3>
                        {stats.latest_candidate ? (
                            <div className="verdict">
                                <ScoreRing value={stats.latest_score} size={110} label="Latest score" />
                                <div className="verdict-text">
                                    <h2 style={{ fontSize: "1.6rem", marginTop: 0 }}>{stats.latest_candidate}</h2>
                                    {stats.latest_recommendation && (
                                        <span className={`badge ${isStrong(stats.latest_recommendation) ? "badge-good" : "badge-warn"}`}>
                                            {stats.latest_recommendation}
                                        </span>
                                    )}
                                    {num(stats.latest_score) === null && <p>No score recorded yet.</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="empty">
                                <h3>No assessments yet</h3>
                                <p>Run your first assessment to see results here.</p>
                                <Link className="btn" to="/interview">Start an assessment</Link>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}

export default Dashboard;
