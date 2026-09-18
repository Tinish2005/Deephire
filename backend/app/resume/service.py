from app.resume.extractor import (
    extract_skills,
    extract_projects,
    extract_experience,
)
from app.resume.scorer import (
    calculate_resume_score
)


def analyze_resume(text: str):
    skills = extract_skills(text)

    projects = extract_projects(text)

    experience = extract_experience(text)

    score_result = calculate_resume_score(
        skills,
        projects,
        experience
    )

    return {
        "skills": skills,
        "projects": projects,
        "experience": experience,
        "score": score_result
    }