from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db

from app.models.candidate_session import CandidateSession
from app.models.final_report import FinalReport

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    total_sessions = (
        db.query(CandidateSession)
        .count()
    )

    total_reports = (
        db.query(FinalReport)
        .count()
    )

    average_score_result = (
        db.query(
            func.avg(FinalReport.overall_score)
        )
        .scalar()
    )

    average_score = (
        round(average_score_result, 2)
        if average_score_result is not None
        else 0.0
    )

    latest_report = (
        db.query(FinalReport)
        .order_by(FinalReport.id.desc())
        .first()
    )

    if latest_report:

        latest_session = (
            db.query(CandidateSession)
            .filter(
                CandidateSession.id == latest_report.session_id
            )
            .first()
        )

        latest_candidate = (
            latest_session.candidate_name
            if latest_session
            else "Unknown"
        )

        latest_recommendation = latest_report.recommendation

        latest_score = latest_report.overall_score

    else:

        latest_candidate = None
        latest_recommendation = None
        latest_score = None

    return {
        "total_sessions": total_sessions,
        "total_reports": total_reports,
        "average_score": average_score,
        "latest_candidate": latest_candidate,
        "latest_score": latest_score,
        "latest_recommendation": latest_recommendation
    }


@router.get("/history")
def get_history(
    db: Session = Depends(get_db)
):

    reports = (
        db.query(FinalReport)
        .order_by(FinalReport.id.asc())
        .all()
    )

    history = []

    strong_count = 0
    average_count = 0

    for report in reports:

        session = (
            db.query(CandidateSession)
            .filter(
                CandidateSession.id == report.session_id
            )
            .first()
        )

        candidate_name = (
            session.candidate_name
            if session
            else "Unknown"
        )

        created_at = (
            session.created_at
            if session
            else None
        )

        if report.recommendation == "Strong Candidate":
            strong_count += 1
        else:
            average_count += 1

        history.append({
            "report_id": report.id,
            "session_id": report.session_id,
            "candidate_name": candidate_name,
            "created_at": created_at,
            "overall_score": report.overall_score,
            "recommendation": report.recommendation,
        })

    return {
        "history": history,
        "strong_candidate_count": strong_count,
        "average_candidate_count": average_count,
    }