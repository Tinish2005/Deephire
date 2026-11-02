import { ScoreRing, Meter } from "./ui";
import { SIGNALS, fmt } from "../lib/signals";

function VoiceDashboard({ analytics }) {
    if (!analytics) return null;
    const color = SIGNALS.voice.color;

    return (
        <section className="panel">
            <div className="verdict">
                <ScoreRing value={analytics.voice_score} size={110} color={color} label="Voice score" />
                <div className="verdict-text">
                    <h3>Voice score</h3>
                    <p className="subtle">Based on transcription of your answer, speaking pace and filler words.</p>
                </div>
            </div>

            {analytics.transcript && <blockquote className="transcript" style={{ marginTop: 20 }}>{analytics.transcript}</blockquote>}

            <dl className="stats">
                <div><dt>Words</dt><dd>{fmt(analytics.word_count)}</dd></div>
                <div><dt>Duration</dt><dd>{fmt(analytics.duration_seconds, 1)}s</dd></div>
                <div><dt>Pace</dt><dd>{fmt(analytics.speaking_rate_wpm)} wpm</dd></div>
                <div><dt>Filler words</dt><dd>{fmt(analytics.filler_word_count)}</dd></div>
            </dl>

            <Meter label="Clarity" value={analytics.clarity_score} color={color} />
            <Meter label="Pace" value={analytics.pace_score} color={color} />
        </section>
    );
}

export default VoiceDashboard;
