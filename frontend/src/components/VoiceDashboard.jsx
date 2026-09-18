function VoiceDashboard({
    analytics
}) {

    if (!analytics) {
        return null;
    }

    return (
        <div
            style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                background: "#f8f8f8"
            }}
        >
            <h2>
                Voice Analytics Dashboard
            </h2>

            <p>
                Transcript:
                {" "}
                "{analytics.transcript}"
            </p>

            <p>
                Word Count:
                {" "}
                {analytics.word_count}
            </p>

            <p>
                Duration:
                {" "}
                {analytics.duration_seconds}
                {" "}seconds
            </p>

            <p>
                Speaking Rate:
                {" "}
                {analytics.speaking_rate_wpm}
                {" "}WPM
            </p>

            <p>
                Filler Words Detected:
                {" "}
                {analytics.filler_word_count}
            </p>

            <hr />

            <p>
                Clarity Score:
                {" "}
                {analytics.clarity_score}
            </p>

            <p>
                Pace Score:
                {" "}
                {analytics.pace_score}
            </p>

            <h3>
                Voice Score:
                {" "}
                {analytics.voice_score}
            </h3>
        </div>
    );
}

export default VoiceDashboard;