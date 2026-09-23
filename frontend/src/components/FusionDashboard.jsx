function FusionDashboard({
    result
}) {

    if (!result) {
        return null;
    }

    const explanation = result.explanation || {};

    const openPdf = () => {
        window.open(
            `http://127.0.0.1:8000/reports/${result.report_id}/export/pdf`,
            "_blank"
        );
    };

    const openJson = () => {
        window.open(
            `http://127.0.0.1:8000/reports/${result.report_id}/export/json`,
            "_blank"
        );
    };

    return (
        <div className="dh-card">
            <h2>Candidate Assessment</h2>

            <p>Resume Score: {result.resume_score}</p>
            <p>Interview Score: {result.interview_score}</p>
            <p>Voice Score: {result.voice_score}</p>
            <p>Vision Score: {result.vision_score}</p>

            <hr />

            <h3>Overall Score: {result.overall_score}</h3>

            <h3>
                Recommendation:{" "}
                <span
                    className={
                        result.recommendation === "Strong Candidate"
                            ? "dh-badge dh-badge-strong"
                            : "dh-badge dh-badge-average"
                    }
                >
                    {result.recommendation}
                </span>
            </h3>

            {explanation.interview && (
                <>
                    <hr />

                    <h3>Why This Score? (Breakdown)</h3>

                    <div className="dh-card-inner">
                        <h4>Interview Answer Quality</h4>

                        <p>Technical Depth: {explanation.interview.technical_depth} / 100</p>
                        <p>Communication Quality: {explanation.interview.communication_quality} / 100</p>
                        <p>Completeness: {explanation.interview.completeness} / 100</p>
                        <p>Relevance to Question: {explanation.interview.relevance} / 100</p>
                    </div>

                    <div className="dh-card-inner">
                        <h4>Voice Delivery</h4>

                        <p>Clarity: {explanation.voice.clarity_score} / 100</p>
                        <p>Speaking Pace: {explanation.voice.pace_score} / 100</p>
                    </div>
                </>
            )}

            {result.report_id && (
                <>
                    <hr />

                    <button className="dh-btn" onClick={openPdf}>
                        Download PDF Report
                    </button>

                    {" "}

                    <button className="dh-btn dh-btn-secondary" onClick={openJson}>
                        View JSON Export
                    </button>
                </>
            )}
        </div>
    );
}

export default FusionDashboard;