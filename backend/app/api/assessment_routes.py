from fastapi import APIRouter

from app.schemas.assessment import (
    AssessmentRequest,
    AssessmentResponse
)
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.final_report import (
    FinalReport
)

router = APIRouter(
    prefix="/assessment",
    tags=["Assessment Pipeline"]
)

@router.post(
    "/run",
    response_model=AssessmentResponse
)
def run_assessment(
    request: AssessmentRequest,
    db: Session = Depends(get_db)
):

    resume_score = 80.0

    interview_score = 85.0

    voice_score = 78.0

    vision_score = 88.0

    overall_score = (
        resume_score +
        interview_score +
        voice_score +
        vision_score
    ) / 4

    recommendation = (
        "Strong Candidate"
        if overall_score >= 80
        else "Average Candidate"
    )

    report = FinalReport(
        session_id=request.session_id,
        overall_score=overall_score,
        recommendation=recommendation,
        strengths="Communication, Attention",
        weaknesses="Technical Depth"
    )

    db.add(report)

    db.commit()

    db.refresh(report)

    return AssessmentResponse(
        session_id=request.session_id,
        resume_score=resume_score,
        interview_score=interview_score,
        voice_score=voice_score,
        vision_score=vision_score,
        overall_score=overall_score,
        recommendation=recommendation
    )