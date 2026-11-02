import { ScoreRing, Meter } from "./ui";
import { API_URL, SIGNALS, isStrong, num } from "../lib/signals";

function FusionDashboard({ result }) {
    if (!result) return null;

    const ex = result.explanation || {};
    const parts = ["resume", "interview", "voice", "vision"]
        .map((k) => [k, num(result[`${k}_score`])])
        .filter(([, v]) => v !== null);
    const best = parts.length ? parts.reduce((a, b) => (b[1] > a[1] ? b : a)) : null;
    const low = parts.length ? parts.reduce((a, b) => (b[1] < a[1] ? b : a)) : null;
    const strong = isStrong(result.recommendation);

    return (
        <div>
            <section className="panel slab">
                <div className="verdict">
                    <ScoreRing value={result.overall_score} size={168} stroke={14} label="Overall score" />
                    <div className="verdict-text">
                        <span className={`badge ${strong ? "badge-good" : "badge-warn"}`}>{result.recommendation}</span>
                        <h2>Overall score {num(result.overall_score) !== null ? Math.round(result.overall_score) : "—"} out of 100</h2>
                        {best && low && best[0] !== low[0] && (
                            <p>
                                Strongest signal: {SIGNALS[best[0]].label} ({Math.round(best[1])}). Lowest: {SIGNALS[low[0]].label} ({Math.round(low[1])}).
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="panel">
                <h3>How each signal contributed</h3>
                <div className="fusion-bars" style={{ maxWidth: 560 }}>
                    {["resume", "interview", "voice", "vision"].map((k) => (
                        <Meter key={k} label={SIGNALS[k].label} value={result[`${k}_score`]} color={SIGNALS[k].color} />
                    ))}
                </div>
            </section>

            {ex.interview && (
                <div className="split" style={{ marginTop: 16 }}>
                    <section className="panel">
                        <h3>Interview answer quality</h3>
                        <Meter label="Technical depth" value={ex.interview.technical_depth} color={SIGNALS.interview.color} />
                        <Meter label="Communication quality" value={ex.interview.communication_quality} color={SIGNALS.interview.color} />
                        <Meter label="Completeness" value={ex.interview.completeness} color={SIGNALS.interview.color} />
                        <Meter label="Relevance to the question" value={ex.interview.relevance} color={SIGNALS.interview.color} />
                    </section>
                    {ex.voice && (
                        <section className="panel">
                            <h3>Voice delivery</h3>
                            <Meter label="Clarity" value={ex.voice.clarity_score} color={SIGNALS.voice.color} />
                            <Meter label="Speaking pace" value={ex.voice.pace_score} color={SIGNALS.voice.color} />
                        </section>
                    )}
                </div>
            )}

            {result.report_id && (
                <div className="btn-row" style={{ marginTop: 20 }}>
                    <a className="btn" href={`${API_URL}/reports/${result.report_id}/export/pdf`} target="_blank" rel="noreferrer">Download PDF report</a>
                    <a className="btn btn-ghost" href={`${API_URL}/reports/${result.report_id}/export/json`} target="_blank" rel="noreferrer">View JSON export</a>
                </div>
            )}
        </div>
    );
}

export default FusionDashboard;
