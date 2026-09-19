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

def generate_dynamic_questions(profile):

    prompt = f"""
Generate 8 interview questions AND a strong model answer for each, tailored specifically
to this candidate's actual field and skill set below.

Do NOT assume this is a software engineering or AI/ML candidate unless their skills,
projects, and experience genuinely indicate that. Determine the candidate's actual
professional domain (e.g. business analysis, marketing, finance, design, data science,
software engineering, operations, etc.) from the information below, and ask questions
a real interviewer in THAT field would ask — testing the skills, tools, and experience
they actually have, not skills from a different field.

If any of the skills happen to include acronyms common in AI/ML tooling — "MCP" means
Model Context Protocol (an AI agent tool standard), NOT Microsoft Certified Professional,
and "RAG" means Retrieval-Augmented Generation — but only apply this interpretation if
the candidate's overall profile is genuinely AI/ML or software-engineering related.

Skills:
{profile.get("skills", [])}

Projects:
{profile.get("projects", [])}

Experience:
{profile.get("experience", [])}

Return ONLY a valid JSON array, with no other text, no markdown code fences, in exactly
this format:

[
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}},
  {{"question": "...", "answer": "..."}}
]
"""

    response = model.generate_content(
        prompt
    )

    raw_text = response.text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        raw_text = raw_text.replace("json", "", 1).strip()

    return json.loads(raw_text)