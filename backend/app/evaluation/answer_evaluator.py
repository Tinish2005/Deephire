def evaluate_answer(
    question: str,
    answer: str
):
    answer = answer.strip()

    if len(answer) == 0:
        return {
            "score": 0,
            "feedback": "No answer provided."
        }

    word_count = len(
        answer.split()
    )

    if word_count < 10:

        return {
            "score": 3,
            "feedback": "Answer is too short."
        }

    elif word_count < 30:

        return {
            "score": 6,
            "feedback": "Answer is acceptable but lacks depth."
        }

    else:

        return {
            "score": 8,
            "feedback": "Good answer with reasonable detail."
        }