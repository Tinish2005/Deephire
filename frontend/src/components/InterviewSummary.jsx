function InterviewSummary({
    attempted,
    average,
    feedback
}) {

    return (
        <div
            style={{
                marginTop: "30px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                background: "#f8f8f8"
            }}
        >
            <h2>
                Interview Summary
            </h2>

            <p>
                Questions Attempted: {attempted}
            </p>

            <p>
                Average Score: {average}
            </p>

            <p>
                Overall Feedback: {feedback}
            </p>
        </div>
    );
}

export default InterviewSummary;