from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.schemas.assessment import (
    AssessmentRequest,
    AssessmentResponse
)

from app.database.db import get_db

from app.models.final_report import (
    FinalReport
)

from app.models.candidate_session import (
    CandidateSession
)

from app.audio.analytics import (
    analyze_audio
)

from app.vision.attention_analyzer import (
    analyze_attention
)

from app.nlp.report_engine import (
    generate_enhanced_report
)

router = APIRouter(
    prefix="/assessment",
    tags=["Assessment Pipeline"]
)

RESUME_SCORE_PLACEHOLDER = 70.0


@router.post(
    "/run",
    response_model=AssessmentResponse
)
def run_assessment(
    request: AssessmentRequest,
    db: Session = Depends(get_db)
):

    session = (
        db.query(CandidateSession)
        .filter(
            CandidateSession.id == request.session_id
        )
        .first()
    )

    if not session:
        return {
            "error": "Session not found."
        }

    resume_score = RESUME_SCORE_PLACEHOLDER

    if session.question_text and session.candidate_answer:
        nlp_result = generate_enhanced_report(
            session.question_text,
            session.expected_answer or "",
            session.candidate_answer
        )
        interview_score = nlp_result.get(
            "final_score",
            0.0
        )
    else:
        interview_score = 0.0

    if session.audio_path:
        audio_result = analyze_audio(
            session.audio_path
        )
        voice_score = audio_result.get(
            "voice_score",
            0.0
        )
    else:
        voice_score = 0.0

    if session.vision_image_path:
        vision_result = analyze_attention(
            session.vision_image_path
        )
        vision_score = vision_result.get(
            "attention_score",
            0.0
        )
    else:
        vision_score = 0.0

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