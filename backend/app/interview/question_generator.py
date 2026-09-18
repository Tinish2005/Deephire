from app.interview.question_bank import (
    TECHNICAL_QUESTIONS,
    BEHAVIORAL_QUESTIONS,
)

from app.interview.gemini_generator import (
    generate_dynamic_questions,
)


def generate_questions(profile):
    technical_questions = []

    skills = profile.get("skills", [])

    unknown_skills = []

    for skill in skills:

        skill_lower = skill.lower()

        if skill_lower in TECHNICAL_QUESTIONS:

            technical_questions.extend(
                TECHNICAL_QUESTIONS[skill_lower]
            )

        else:

            unknown_skills.append(skill)

    if unknown_skills:

        try:

            dynamic_text = (
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

            for line in dynamic_text.split("\n"):

                clean_line = line.strip()

                if len(clean_line) < 10:
                    continue

                if clean_line[0].isdigit():

                    clean_line = clean_line.split(
                        ".",
                        1
                    )[-1].strip()

                technical_questions.append(
                    clean_line
                )

        except Exception:

            for skill in unknown_skills:

                technical_questions.append(
                    f"Explain your experience with {skill}"
                )

    technical_questions = technical_questions[:8]

    behavioral_questions = BEHAVIORAL_QUESTIONS[:2]

    return {
        "technical": technical_questions,
        "behavioral": behavioral_questions,
        "total_questions": len(technical_questions) + len(behavioral_questions)
    }