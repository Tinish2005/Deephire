import { ScoreRing } from "./ui";
import { SIGNALS } from "../lib/signals";

function VisionDashboard({ result }) {
    if (!result) return null;
    const detected = Boolean(result.face_detected);

    return (
        <section className="panel">
            <div className="verdict">
                <ScoreRing value={result.attention_score} size={110} color={SIGNALS.vision.color} label="Attention score" />
                <div className="verdict-text">
                    <h3>Attention score</h3>
                    <p className="subtle">How centered your face is in the frame.</p>
                    <div className="chips" style={{ marginTop: 12 }}>
                        <span className={`badge ${detected ? "badge-good" : "badge-warn"}`}>
                            {detected ? "Face detected" : "No face detected"}
                        </span>
                        {result.face_count != null && <span className="badge badge-warn" style={{ background: "var(--line-2)", color: "var(--ink-2)" }}>{result.face_count} in frame</span>}
                    </div>
                    {!detected && <p className="subtle" style={{ marginTop: 10 }}>Move closer, face the camera and add light, then capture again.</p>}
                </div>
            </div>
        </section>
    );
}

export default VisionDashboard;
