from fastapi import APIRouter
from pydantic import BaseModel

from app.fusion.fusion_engine import (
    calculate_overall_score
)
from app.fusion.assessment_engine import (
    generate_assessment
)
from app.fusion.recommendation_engine import (
    generate_recommendations
)
from app.fusion.report_engine import (
    generate_report
)

router = APIRouter(
    prefix="/fusion",
    tags=["Fusion"]
)


class FusionRequest(BaseModel):

    resume_score: float
    interview_score: float
    voice_score: float
    vision_score: float


@router.get("/health")
def fusion_health():

    return {
        "status": "ok",
        "module": "fusion"
    }


@router.post("/calculate")
def fusion_calculate(
    request: FusionRequest
):

    return calculate_overall_score(

        request.resume_score,

        request.interview_score,

        request.voice_score,

        request.vision_score
    )
@router.post("/assess")
def assess_candidate(
    request: FusionRequest
):

    fusion_result = (
        calculate_overall_score(
            request.resume_score,
            request.interview_score,
            request.voice_score,
            request.vision_score
        )
    )

    return generate_assessment(

    request.resume_score,

    request.interview_score,

    request.voice_score,

    request.vision_score,

    fusion_result["overall_score"]
)
@router.post("/recommend")
def recommend_candidate(
    request: FusionRequest
):

    return generate_recommendations(

        request.resume_score,

        request.interview_score,

        request.voice_score,

        request.vision_score
    )
class ReportRequest(
    BaseModel
):

    candidate_name: str

    resume_score: float

    interview_score: float

    voice_score: float

    vision_score: float

@router.post("/report")
def final_report(
    request: ReportRequest
):

    fusion_result = (
        calculate_overall_score(

            request.resume_score,

            request.interview_score,

            request.voice_score,

            request.vision_score
        )
    )

    assessment = (
        generate_assessment(

            request.resume_score,

            request.interview_score,

            request.voice_score,

            request.vision_score,

            fusion_result[
                "overall_score"
            ]
        )
    )

    recommendations = (
        generate_recommendations(

            request.resume_score,

            request.interview_score,

            request.voice_score,

            request.vision_score
        )
    )

    return generate_report(

        request.candidate_name,

        request.resume_score,

        request.interview_score,

        request.voice_score,

        request.vision_score,

        fusion_result[
            "overall_score"
        ],

        assessment[
            "recommendation"
        ],

        recommendations[
            "strengths"
        ],

        recommendations[
            "weaknesses"
        ]
    )
    