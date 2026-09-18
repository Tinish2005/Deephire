def calculate_resume_score(
    skills: list,
    projects: list,
    experience: list
):

    skill_score = min(
        len(skills) / 8,
        1.0
    ) * 100

    project_score = min(
        len(projects) / 3,
        1.0
    ) * 100

    experience_score = min(
        len(experience) / 2,
        1.0
    ) * 100

    resume_score = (
        (skill_score * 0.5) +
        (project_score * 0.25) +
        (experience_score * 0.25)
    )

    return {
        "resume_score": round(resume_score, 2),
        "skill_score": round(skill_score, 2),
        "project_score": round(project_score, 2),
        "experience_score": round(experience_score, 2),
        "skills_matched": len(skills),
        "projects_found": len(projects),
        "experience_found": len(experience)
    }