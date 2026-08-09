function FusionDashboard({
    result
}) {

    if (!result) {
        return null;
    }

    return (
        <div
            style={{
                padding: "20px",
                marginTop: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                background: "#f8f8f8"
            }}
        >
            <h2>
                Candidate Assessment
            </h2>

            <p>
                Resume Score:
                {" "}
                {result.resume_score}
            </p>

            <p>
                Interview Score:
                {" "}
                {result.interview_score}
            </p>

            <p>
                Voice Score:
                {" "}
                {result.voice_score}
            </p>

            <p>
                Vision Score:
                {" "}
                {result.vision_score}
            </p>

            <hr />

            <h3>
                Overall Score:
                {" "}
                {result.overall_score}
            </h3>

            <h3>
                Recommendation:
                {" "}
                {result.recommendation}
            </h3>
        </div>
    );
}

export default FusionDashboard;