from app.resume.extractor import (
    extract_skills,
    extract_projects,
    extract_experience,
)


def analyze_resume(text: str):
    skills = extract_skills(text)

    projects = extract_projects(text)

    experience = extract_experience(text)

    return {
        "skills": skills,
        "projects": projects,
        "experience": experience,
    }