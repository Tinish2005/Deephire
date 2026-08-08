def generate_summary(results):

    if len(results) == 0:

        return {
            "questions_attempted": 0,
            "average_score": 0,
            "overall_feedback": "No answers submitted yet."
        }

    total_score = sum(
        result["score"]
        for result in results
    )

    average_score = round(
        total_score / len(results),
        2
    )

    if average_score >= 8:

        feedback = (
            "Excellent performance."
        )

    elif average_score >= 6:

        feedback = (
            "Good performance with room for improvement."
        )

    else:

        feedback = (
            "Needs improvement."
        )

    return {
        "questions_attempted":
            len(results),

        "average_score":
            average_score,

        "overall_feedback":
            feedback
    }