from app.interview.question_bank import (
    BEHAVIORAL_QUESTIONS,
)

from app.interview.gemini_generator import (
    generate_dynamic_questions,
)


def generate_questions(profile):

    skills = profile.get("skills", [])

    technical_questions = []

    if skills:

        try:

            dynamic_pairs = generate_dynamic_questions(
                {
                    "skills": skills,
                    "projects": profile.get(
                        "projects",
                        [],
                    ),
                    "experience": profile.get(
                        "experience",
                        [],
                    ),
                }
            )

            for pair in dynamic_pairs:

                technical_questions.append(
                    {
                        "question": pair.get("question", ""),
                        "answer": pair.get("answer", "")
                    }
                )

        except Exception:

            for skill in skills[:8]:

                technical_questions.append(
                    {
                        "question": f"Explain your experience with {skill}",
                        "answer": ""
                    }
                )

    technical_questions = technical_questions[:8]

    behavioral_questions = [
        {"question": q, "answer": ""}
        for q in BEHAVIORAL_QUESTIONS[:2]
    ]

    return {
        "technical": technical_questions,
        "behavioral": behavioral_questions,
        "total_questions": len(technical_questions) + len(behavioral_questions)
    }