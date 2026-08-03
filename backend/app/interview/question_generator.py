from app.interview.question_bank import (
    TECHNICAL_QUESTIONS,
    BEHAVIORAL_QUESTIONS,
)

from app.interview.gemini_generator import (
    generate_dynamic_questions,
)


def generate_questions(profile):
    questions = []

    skills = profile.get("skills", [])

    unknown_skills = []

    for skill in skills:

        skill_lower = skill.lower()

        if skill_lower in TECHNICAL_QUESTIONS:

            questions.extend(
                TECHNICAL_QUESTIONS[skill_lower]
            )

        else:

            unknown_skills.append(skill)

    if unknown_skills:

        try:

            dynamic_questions = (
                generate_dynamic_questions(
                    {
                        "skills": unknown_skills,
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
            )

            questions.append(dynamic_questions)

        except Exception:

            for skill in unknown_skills:

                questions.append(
                    f"Explain your experience with {skill}"
                )

    questions.extend(
        BEHAVIORAL_QUESTIONS
    )

    return questions