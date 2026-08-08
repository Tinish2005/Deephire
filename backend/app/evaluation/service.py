from app.evaluation.answer_evaluator import (
    evaluate_answer
)


def score_answer(
    question: str,
    answer: str
):
    return evaluate_answer(
        question,
        answer
    )