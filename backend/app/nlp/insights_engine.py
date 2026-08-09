from app.nlp.similarity_engine import (
    compute_similarity
)
from app.nlp.distilbert_engine import (
    evaluate_answer_distilbert
)


def generate_insights(
    expected_answer: str,
    candidate_answer: str
):
    candidate_answer = candidate_answer.strip()

    if len(candidate_answer) == 0:
        return {
            "error": "Candidate answer is empty."
        }

    similarity_result = compute_similarity(
        expected_answer,
        candidate_answer
    )

    distilbert_result = evaluate_answer_distilbert(
        candidate_answer
    )

    word_count = len(
        candidate_answer.split()
    )
    sentence_count = max(
        candidate_answer.count(".") +
        candidate_answer.count("?") +
        candidate_answer.count("!"),
        1
    )
    avg_words_per_sentence = word_count / sentence_count

    relevance = similarity_result.get(
        "similarity_score",
        0.0
    )

    technical_depth = distilbert_result.get(
        "ai_evaluation_score",
        0.0
    )

    completeness = min(
        (word_count / 50) * 100,
        100
    )

    structure_penalty = 0
    if avg_words_per_sentence > 40:
        structure_penalty = 15
    elif avg_words_per_sentence < 4:
        structure_penalty = 10

    communication_quality = max(
        min(
            ((word_count / 40) * 60) + 40 - structure_penalty,
            100
        ),
        0
    )

    return {
        "technical_depth": round(technical_depth, 2),
        "communication_quality": round(communication_quality, 2),
        "completeness": round(completeness, 2),
        "relevance": round(relevance, 2),
        "word_count": word_count,
        "avg_words_per_sentence": round(avg_words_per_sentence, 2)
    }