import numpy as np

from app.nlp.embedding_engine import (
    generate_embedding
)


def cosine_similarity(
    vector_a,
    vector_b
):
    a = np.array(vector_a)
    b = np.array(vector_b)

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    similarity = np.dot(a, b) / (norm_a * norm_b)

    return float(similarity)


def compute_similarity(
    expected_answer: str,
    candidate_answer: str
):
    expected_result = generate_embedding(
        expected_answer
    )
    candidate_result = generate_embedding(
        candidate_answer
    )

    if expected_result["embedding"] is None or candidate_result["embedding"] is None:
        return {
            "similarity_score": 0.0,
            "error": "One or both inputs were empty."
        }

    score = cosine_similarity(
        expected_result["embedding"],
        candidate_result["embedding"]
    )

    normalized_score = round(
        (score + 1) / 2 * 100,
        2
    )

    return {
        "raw_cosine_similarity": round(score, 4),
        "similarity_score": normalized_score,
        "model": "all-MiniLM-L6-v2"
    }