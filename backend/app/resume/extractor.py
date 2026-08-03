import re

SKILLS = [
    "python",
    "java",
    "c++",
    "react",
    "fastapi",
    "docker",
    "sql",
    "postgresql",
    "pytorch",
    "tensorflow",
    "flask",
    "javascript",
    "langchain",
    "rag",
    "mcp",
    "gemini",
]


def extract_skills(text: str):
    text_lower = text.lower()

    found_skills = []

    for skill in SKILLS:
        if skill in text_lower:
            found_skills.append(skill)

    return sorted(list(set(found_skills)))


def extract_projects(text: str):
    projects = []

    lines = text.split("\n")

    project_keywords = [
        "github agent",
        "review platform",
        "deephire",
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


def extract_experience(text: str):
    experiences = []

    lines = text.split("\n")

    role_keywords = [
        "intern",
        "engineer",
        "developer",
        "analyst",
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