from fastapi import APIRouter
from pydantic import BaseModel

from app.nlp.embedding_engine import (
    generate_embedding
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
from app.nlp.report_engine import (
    generate_enhanced_report
)

router = APIRouter(
    prefix="/nlp",
    tags=["NLP - Deep Learning"]
)


class EmbeddingRequest(BaseModel):
    text: str


class SimilarityRequest(BaseModel):
    expected_answer: str
    candidate_answer: str


class DistilBertRequest(BaseModel):
    answer: str


class InsightsRequest(BaseModel):
    expected_answer: str
    candidate_answer: str


class ReportRequest(BaseModel):
    question: str
    expected_answer: str
    candidate_answer: str


@router.get("/health")
def nlp_health():

    return {
        "status": "ok",
        "module": "nlp"
    }


@router.post("/embed")
def embed_text(
    request: EmbeddingRequest
):
    result = generate_embedding(
        request.text
    )

    return result


@router.post("/similarity")
def evaluate_similarity(
    request: SimilarityRequest
):
    result = compute_similarity(
        request.expected_answer,
        request.candidate_answer
    )

    return result


@router.post("/distilbert-score")
def distilbert_score(
    request: DistilBertRequest
):
    result = evaluate_answer_distilbert(
        request.answer
    )

    return result


@router.post("/insights")
def nlp_insights(
    request: InsightsRequest
):
    result = generate_insights(
        request.expected_answer,
        request.candidate_answer
    )

    return result


@router.post("/report")
def enhanced_report(
    request: ReportRequest
):
    result = generate_enhanced_report(
        request.question,
        request.expected_answer,
        request.candidate_answer
    )

    return result