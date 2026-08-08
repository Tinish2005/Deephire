def calculate_overall_score(

    resume_score,

    interview_score,

    voice_score,

    vision_score

):

    overall_score = round(

        (
            resume_score
            +
            interview_score
            +
            voice_score
            +
            vision_score
        ) / 4,

        2
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
            overall_score
    }
