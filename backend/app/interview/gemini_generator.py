import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)

def generate_dynamic_questions(profile):

    prompt = f"""
Generate 5 technical interview questions.

Skills:
{profile.get("skills", [])}

Projects:
{profile.get("projects", [])}

Experience:
{profile.get("experience", [])}

Return only questions.
"""

    response = model.generate_content(
        prompt
    )

    return response.text