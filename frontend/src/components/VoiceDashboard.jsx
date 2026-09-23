function VoiceDashboard({
    analytics
}) {

    if (!analytics) {
        return null;
    }

    return (
        <div className="dh-card">
            <h2>Voice Analytics</h2>

            <p>Transcript: "{analytics.transcript}"</p>
            <p>Word Count: {analytics.word_count}</p>
            <p>Duration: {analytics.duration_seconds} seconds</p>
            <p>Speaking Rate: {analytics.speaking_rate_wpm} WPM</p>
            <p>Filler Words Detected: {analytics.filler_word_count}</p>

            <hr />

            <p>Clarity Score: {analytics.clarity_score}</p>
            <p>Pace Score: {analytics.pace_score}</p>

            <h3>Voice Score: {analytics.voice_score}</h3>
        </div>
    );
}

export default VoiceDashboard;