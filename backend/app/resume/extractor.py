import re

from app.resume.gemini_skill_extractor import (
    extract_skills_with_gemini,
    extract_projects_with_gemini,
    extract_experience_with_gemini,
)

SKILLS = [
    # AI / ML / GenAI
    "python",
    "pytorch",
    "tensorflow",
    "keras",
    "scikit-learn",
    "pandas",
    "numpy",
    "langchain",
    "langgraph",
    "crewai",
    "rag",
    "mcp",
    "gemini",
    "openai",
    "huggingface",

    # Backend / languages
    "java",
    "c++",
    "c#",
    "javascript",
    "typescript",
    "go",
    "golang",
    "rust",
    "kotlin",
    "swift",
    "php",
    "ruby",

    # Web frameworks
    "fastapi",
    "flask",
    "django",
    "express",
    "node.js",
    "nodejs",
    "react",
    "angular",
    "vue",
    "html",
    "css",

    # Databases
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "cassandra",
    "dynamodb",

    # Cloud / DevOps
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "terraform",
    "jenkins",
    "ci/cd",

    # Data / analytics
    "spark",
    "hadoop",
    "tableau",
    "power bi",
    "excel",
]


def extract_skills_keyword_fallback(text: str):
    text_lower = text.lower()

    found_skills = []

    for skill in SKILLS:

        pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"

        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return sorted(list(set(found_skills)))


def extract_projects_keyword_fallback(text: str):
    projects = []

    lines = text.split("\n")

    project_keywords = [
        "project",
    ]

    for line in lines:
        clean_line = line.strip()

        if len(clean_line) < 5:
            continue

        for keyword in project_keywords:
            if keyword in clean_line.lower():
                projects.append(clean_line)
                break

    return projects[:5]


def extract_experience_keyword_fallback(text: str):
    experiences = []

    lines = text.split("\n")

    role_keywords = [
        "intern",
        "engineer",
        "developer",
        "analyst",
        "manager",
        "coordinator",
        "generalist",
        "specialist",
        "consultant",
        "associate",
        "officer",
        "executive",
    ]

    for line in lines:
        clean_line = line.strip()

        if len(clean_line) < 5:
            continue

        for keyword in role_keywords:
            if keyword in clean_line.lower():
                experiences.append(clean_line)
                break

    return experiences[:5]


def extract_skills(text: str):

    try:

        skills = extract_skills_with_gemini(text)

        if skills:
            return skills

        return extract_skills_keyword_fallback(text)

    except Exception:

        return extract_skills_keyword_fallback(text)


def extract_projects(text: str):

    projects = extract_projects_with_gemini(text)

    if projects:
        return projects

    return extract_projects_keyword_fallback(text)


def extract_experience(text: str):

    experience = extract_experience_with_gemini(text)

    if experience:
        return experience

    return extract_experience_keyword_fallback(text)