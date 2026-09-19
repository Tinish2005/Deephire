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

from app.models.session_answer import (
    SessionAnswer
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

    resume_score = (
        session.resume_score
        if session.resume_score is not None
        else 0.0
    )

    answers = (
        db.query(SessionAnswer)
        .filter(
            SessionAnswer.session_id == request.session_id
        )
        .all()
    )

    technical_depth_total = 0.0
    communication_quality_total = 0.0
    completeness_total = 0.0
    relevance_total = 0.0
    interview_total = 0.0

    if answers:

        for answer in answers:

            nlp_result = generate_enhanced_report(
                answer.question_text,
                answer.expected_answer or "",
                answer.candidate_answer
            )

            interview_total += nlp_result.get(
                "final_score",
                0.0
            )

            insights = nlp_result.get(
                "nlp_insights",
                {}
            )

            technical_depth_total += insights.get(
                "technical_depth",
                0.0
            )
            communication_quality_total += insights.get(
                "communication_quality",
                0.0
            )
            completeness_total += insights.get(
                "completeness",
                0.0
            )
            relevance_total += insights.get(
                "relevance",
                0.0
            )

        answer_count = len(answers)

        interview_score = round(
            interview_total / answer_count,
            2
        )

        technical_depth_avg = round(
            technical_depth_total / answer_count,
            2
        )
        communication_quality_avg = round(
            communication_quality_total / answer_count,
            2
        )
        completeness_avg = round(
            completeness_total / answer_count,
            2
        )
        relevance_avg = round(
            relevance_total / answer_count,
            2
        )

    else:

        interview_score = 0.0
        technical_depth_avg = 0.0
        communication_quality_avg = 0.0
        completeness_avg = 0.0
        relevance_avg = 0.0

    if session.audio_path:
        audio_result = analyze_audio(
            session.audio_path
        )
        voice_score = audio_result.get(
            "voice_score",
            0.0
        )
        clarity_score = audio_result.get(
            "clarity_score",
            0.0
        )
        pace_score = audio_result.get(
            "pace_score",
            0.0
        )
    else:
        voice_score = 0.0
        clarity_score = 0.0
        pace_score = 0.0

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

    overall_score = round(
        (
            resume_score +
            interview_score +
            voice_score +
            vision_score
        ) / 4,
        2
    )

    recommendation = (
        "Strong Candidate"
        if overall_score >= 80
        else "Average Candidate"
    )

    explanation = {
        "resume": {
            "score": resume_score,
            "skill_score": session.resume_score,
        },
        "interview": {
            "score": interview_score,
            "technical_depth": technical_depth_avg,
            "communication_quality": communication_quality_avg,
            "completeness": completeness_avg,
            "relevance": relevance_avg,
        },
        "voice": {
            "score": voice_score,
            "clarity_score": clarity_score,
            "pace_score": pace_score,
        },
        "vision": {
            "score": vision_score,
        },
    }

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

    return {
        "session_id": request.session_id,
        "resume_score": resume_score,
        "interview_score": interview_score,
        "voice_score": voice_score,
        "vision_score": vision_score,
        "overall_score": overall_score,
        "recommendation": recommendation,
        "explanation": explanation,
    }