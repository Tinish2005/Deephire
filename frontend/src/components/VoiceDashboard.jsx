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
                File Size:
                {" "}
                {analytics.file_size_bytes}
                {" "}bytes
            </p>

            <p>
                Duration:
                {" "}
                {analytics.duration_seconds}
                {" "}seconds
            </p>

            <p>
                Estimated WPM:
                {" "}
                {analytics.estimated_wpm}
            </p>
        </div>
    );
}

export default VoiceDashboard;