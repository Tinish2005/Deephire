import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { getHistory } from "../services/dashboardService";
import { SIGNALS, fmt, isStrong, num, shortDate } from "../lib/signals";

function ChartTip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return <div className="tooltip"><b>{d.name}</b><br />Score {Math.round(d.score)}</div>;
}

function History() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setData(await getHistory());
            } catch (err) {
                console.error(err);
                setError("Could not load history. Check that the backend is running.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const history = data?.history || [];

    const trend = useMemo(
        () =>
            [...history]
                .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0) || a.report_id - b.report_id)
                .map((h) => ({ id: `#${h.session_id}`, name: h.candidate_name, score: num(h.overall_score) ?? 0, date: shortDate(h.created_at) })),
        [history]
    );

    const rows = history.filter((h) => (h.candidate_name || "").toLowerCase().includes(query.trim().toLowerCase()));

    return (
        <main className="page">
            <div className="page-head">
                <h2>History</h2>
                <p>Every completed assessment, with the score trend across candidates.</p>
            </div>

            {loading && <div className="panel"><div className="skeleton" style={{ width: "60%" }} /><div className="skeleton" style={{ width: "85%" }} /></div>}
            {error && <p className="msg msg-err" role="alert">{error}</p>}

            {data && (
                <>
                    <dl className="readout slab" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                        <div><dt>Assessments</dt><dd>{history.length}</dd></div>
                        <div><dt>Strong candidates</dt><dd>{fmt(data.strong_candidate_count)}</dd></div>
                        <div><dt>Average candidates</dt><dd>{fmt(data.average_candidate_count)}</dd></div>
                    </dl>

                    {history.length === 0 ? (
                        <section className="panel empty" style={{ marginTop: 16 }}>
                            <h3>No assessments yet</h3>
                            <p>Completed assessments appear here with their scores.</p>
                            <Link className="btn" to="/interview">Start an assessment</Link>
                        </section>
                    ) : (
                        <>
                            <section className="panel" style={{ marginTop: 16 }}>
                                <h3>Score trend</h3>
                                <div style={{ width: "100%", height: 260 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={trend} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
                                            <CartesianGrid stroke="#E4E6EB" vertical={false} />
                                            <XAxis dataKey="id" tickLine={false} axisLine={false} tick={{ fill: "#5C6370", fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#5C6370", fontSize: 12 }} />
                                            <Tooltip content={<ChartTip />} cursor={{ stroke: "#B9BFC9" }} />
                                            <Line type="monotone" dataKey="score" stroke={SIGNALS.resume.hex} strokeWidth={3} dot={{ r: 4, fill: SIGNALS.resume.hex, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            <section className="panel">
                                <div className="q-meta" style={{ marginBottom: 14 }}>
                                    <h3 style={{ margin: 0 }}>All assessments</h3>
                                    <input className="input" style={{ maxWidth: 240 }} placeholder="Search by name" aria-label="Search by candidate name" value={query} onChange={(e) => setQuery(e.target.value)} />
                                </div>
                                <div className="table-wrap">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Session</th><th>Candidate</th><th>Date</th><th>Overall score</th><th>Recommendation</th></tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((h) => (
                                                <tr key={h.report_id}>
                                                    <td>#{h.session_id}</td>
                                                    <td>{h.candidate_name}</td>
                                                    <td>{h.created_at ? new Date(h.created_at).toLocaleString() : "N/A"}</td>
                                                    <td className="num">{fmt(h.overall_score)}<span className="mini-bar"><i style={{ width: `${Math.min(100, num(h.overall_score) ?? 0)}%` }} /></span></td>
                                                    <td><span className={`badge ${isStrong(h.recommendation) ? "badge-good" : "badge-warn"}`}>{h.recommendation}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {rows.length === 0 && <p className="empty">No candidates match "{query}".</p>}
                                </div>
                            </section>
                        </>
                    )}
                </>
            )}
        </main>
    );
}

export default History;
