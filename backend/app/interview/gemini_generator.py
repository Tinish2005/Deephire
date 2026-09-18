import os
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
Generate 5 technical interview questions for a candidate with the following background.

These skills are from a resume in the context of AI/ML and software engineering. Interpret
acronyms accordingly — for example, "MCP" means Model Context Protocol (an AI agent tool
standard), NOT Microsoft Certified Professional. "RAG" means Retrieval-Augmented Generation.

Skills:
{profile.get("skills", [])}

Projects:
{profile.get("projects", [])}

Experience:
{profile.get("experience", [])}

Return only the 5 questions, numbered, with no other commentary.
"""

    response = model.generate_content(
        prompt
    )

    return response.text