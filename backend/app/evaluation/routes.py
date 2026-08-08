from fastapi import APIRouter
from pydantic import BaseModel

from app.evaluation.service import (
    score_answer
)

from app.evaluation.analytics import (
    generate_summary
)

router = APIRouter(
    prefix="/evaluation",
    tags=["Evaluation"]
)


class AnswerRequest(BaseModel):
    question: str
    answer: str


@router.get("/health")
def evaluation_health():

    return {
        "status": "ok",
        "module": "evaluation"
    }


@router.post("/score")
def evaluate(
    request: AnswerRequest
):

    result = score_answer(
        request.question,
        request.answer
    )

    return result


@router.get("/analytics/demo")
def analytics_demo():

    sample_results = [
        {
            "score": 8
        },
        {
            "score": 6
        },
        {
            "score": 7
        }
    ]

    return generate_summary(
        sample_results
    )