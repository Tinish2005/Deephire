def generate_recommendations(
    resume_score,
    interview_score,
    voice_score,
    vision_score
):

    strengths = []

    weaknesses = []

    if resume_score >= 75:
        strengths.append(
            "Strong Resume"
        )
    else:
        weaknesses.append(
            "Resume Quality"
        )

    if interview_score >= 75:
        strengths.append(
            "Technical Interview Performance"
        )
    else:
        weaknesses.append(
            "Technical Interview Skills"
        )

    if voice_score >= 75:
        strengths.append(
            "Communication Skills"
        )
    else:
        weaknesses.append(
            "Communication Clarity"
        )

    if vision_score >= 75:
        strengths.append(
            "Attention and Presence"
        )
    else:
        weaknesses.append(
            "Attention Consistency"
        )

    return {

        "strengths":
            strengths,

        "weaknesses":
            weaknesses
    }