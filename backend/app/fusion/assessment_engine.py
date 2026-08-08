def generate_assessment(

    resume_score,

    interview_score,

    voice_score,

    vision_score,

    overall_score

):

    if overall_score >= 85:

        recommendation = (
            "Excellent Candidate"
        )

    elif overall_score >= 70:

        recommendation = (
            "Strong Candidate"
        )

    elif overall_score >= 50:

        recommendation = (
            "Average Candidate"
        )

    else:

        recommendation = (
            "Needs Improvement"
        )

    return {

        "resume_score":
            resume_score,

        "interview_score":
            interview_score,

        "voice_score":
            voice_score,

        "vision_score":
            vision_score,

        "overall_score":
            overall_score,

        "recommendation":
            recommendation
    }