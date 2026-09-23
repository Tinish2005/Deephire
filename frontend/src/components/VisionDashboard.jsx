function VisionDashboard({
    result
}) {

    if (!result) {
        return null;
    }

    return (
        <div className="dh-card">
            <h2>Vision Analysis</h2>

            <p>Face Detected: {result.face_detected ? "Yes" : "No"}</p>
            <p>Face Count: {result.face_count ?? "N/A"}</p>
            <p>Attention Score: {result.attention_score ?? "N/A"}</p>
        </div>
    );
}

export default VisionDashboard;