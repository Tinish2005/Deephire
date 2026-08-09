from app.evaluation.answer_evaluator import (
    evaluate_answer
)
from app.nlp.similarity_engine import (
    compute_similarity
)
from app.nlp.distilbert_engine import (
    evaluate_answer_distilbert
)
from app.nlp.insights_engine import (
    generate_insights
)


def generate_enhanced_report(
    question: str,
    expected_answer: str,
    candidate_answer: str
):
    candidate_answer = candidate_answer.strip()

    if len(candidate_answer) == 0:
        return {
            "error": "Candidate answer is empty."
        }

    rule_based_result = evaluate_answer(
        question,
        candidate_answer
    )

    similarity_result = compute_similarity(
        expected_answer,
        candidate_answer
    )

    distilbert_result = evaluate_answer_distilbert(
        candidate_answer
    )

    insights_result = generate_insights(
        expected_answer,
        candidate_answer
    )

    rule_based_score = rule_based_result.get(
        "score",
        0
    ) * 10

    similarity_score = similarity_result.get(
        "similarity_score",
        0.0
    )

    transformer_score = distilbert_result.get(
        "ai_evaluation_score",
        0.0
    )

    final_score = round(
        (rule_based_score * 0.2) +
        (similarity_score * 0.4) +
        (transformer_score * 0.4),
        2
    )

    return {
        "final_score": final_score,
        "rule_based_evaluation": rule_based_result,
        "transformer_evaluation": {
            "semantic_similarity": similarity_result,
            "distilbert_evaluation": distilbert_result
        },
        "nlp_insights": insights_result
    }