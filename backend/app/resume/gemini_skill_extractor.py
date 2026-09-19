import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def _extract_json_array(prompt: str):

    response = model.generate_content(
        prompt
    )

    raw_text = response.text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        raw_text = raw_text.replace("json", "", 1).strip()

    return json.loads(raw_text)


def extract_skills_with_gemini(text: str):

    prompt = f"""
Extract the professional skills from the resume text below. This resume could be from
ANY field — software engineering, business analytics, marketing, finance, design,
healthcare, human resources, education, or anything else. Do not assume it is a
technical resume.

List every genuine skill mentioned: technical tools, software, programming languages,
methodologies, soft skills explicitly named, certifications, and domain-specific
competencies. Use short, standard, lowercase names for each skill (e.g. "excel",
"power bi", "financial modeling", "project management", "python").

Resume text:
{text}

Return ONLY a valid JSON array of strings, with no other text, no markdown code fences,
in exactly this format:

["skill one", "skill two", "skill three"]
"""

    skills = _extract_json_array(prompt)

    return sorted(set(
        skill.strip().lower()
        for skill in skills
        if isinstance(skill, str) and skill.strip()
    ))


def extract_projects_with_gemini(text: str):

    prompt = f"""
Extract the distinct projects mentioned in the resume text below. This resume could be
from ANY field, not just software engineering — a project could be a marketing
campaign, an HR initiative, a research study, a construction project, an audit,
an event, or anything else described as a discrete piece of work with a name or
clear scope.

For each project found, return a short one-sentence description combining its name
(if given) and what it involved.

Resume text:
{text}

Return ONLY a valid JSON array of strings, with no other text, no markdown code fences,
in exactly this format:

["project one description", "project two description"]

If no distinct projects are mentioned, return an empty array: []
"""

    try:
        projects = _extract_json_array(prompt)

        return [
            p.strip()
            for p in projects
            if isinstance(p, str) and p.strip()
        ][:5]

    except Exception:
        return []


def extract_experience_with_gemini(text: str):

    prompt = f"""
Extract the work experience entries from the resume text below. This resume could be
from ANY field, not just software engineering — job titles could be things like
"HR Generalist," "Business Analyst," "Marketing Coordinator," "Registered Nurse,"
"Financial Analyst," or anything else.

For each distinct role/position found, return a short one-sentence summary combining
the job title, company (if given), and duration (if given).

Resume text:
{text}

Return ONLY a valid JSON array of strings, with no other text, no markdown code fences,
in exactly this format:

["role one summary", "role two summary"]

If no work experience is mentioned, return an empty array: []
"""

    try:
        experience = _extract_json_array(prompt)

        return [
            e.strip()
            for e in experience
            if isinstance(e, str) and e.strip()
        ][:5]

    except Exception:
        return []