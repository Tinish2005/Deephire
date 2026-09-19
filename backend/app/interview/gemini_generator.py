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
Generate 5 technical interview questions AND a strong model answer for each,
for a candidate with the following background.

These skills are from a resume in the context of AI/ML and software engineering. Interpret
acronyms accordingly — for example, "MCP" means Model Context Protocol (an AI agent tool
standard), NOT Microsoft Certified Professional. "RAG" means Retrieval-Augmented Generation.

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