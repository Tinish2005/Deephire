from app.interview.question_generator import (
    generate_questions
)


def build_interview(profile):
    result = generate_questions(profile)

    return result