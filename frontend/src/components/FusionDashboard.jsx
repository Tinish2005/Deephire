function FusionDashboard({
    result
}) {

    if (!result) {
        return null;
    }

    const explanation = result.explanation || {};

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

            {explanation.interview && (
                <>
                    <hr />

                    <h3>Why This Score? (Breakdown)</h3>

                    <div
                        style={{
                            marginTop: "10px",
                            padding: "15px",
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                        }}
                    >
                        <h4>Interview Answer Quality</h4>

                        <p>
                            Technical Depth:
                            {" "}
                            {explanation.interview.technical_depth}
                            {" "}/ 100
                        </p>

                        <p>
                            Communication Quality:
                            {" "}
                            {explanation.interview.communication_quality}
                            {" "}/ 100
                        </p>

                        <p>
                            Completeness:
                            {" "}
                            {explanation.interview.completeness}
                            {" "}/ 100
                        </p>

                        <p>
                            Relevance to Question:
                            {" "}
                            {explanation.interview.relevance}
                            {" "}/ 100
                        </p>
                    </div>

                    <div
                        style={{
                            marginTop: "10px",
                            padding: "15px",
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: "8px",
                        }}
                    >
                        <h4>Voice Delivery</h4>

                        <p>
                            Clarity:
                            {" "}
                            {explanation.voice.clarity_score}
                            {" "}/ 100
                        </p>

                        <p>
                            Speaking Pace:
                            {" "}
                            {explanation.voice.pace_score}
                            {" "}/ 100
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

export default FusionDashboard;