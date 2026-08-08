function VisionDashboard({
    result
}) {

    if (!result) {
        return null;
    }

    return (
        <div
            style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                background: "#f7f7f7"
            }}
        >
            <h2>
                Vision Dashboard
            </h2>

            <p>
                Face Detected:
                {" "}
                {
                    result.face_detected
                        ? "Yes"
                        : "No"
                }
            </p>

            <p>
                Face Count:
                {" "}
                {
                    result.face_count ??
                    "N/A"
                }
            </p>

            <p>
                Attention Score:
                {" "}
                {
                    result.attention_score ??
                    "N/A"
                }
            </p>

        </div>
    );
}

export default VisionDashboard;