from app.interview.question_generator import (
    generate_questions
)


def build_interview(profile):
    questions = generate_questions(profile)

    return {
        "total_questions": len(questions),
        "questions": questions
    }