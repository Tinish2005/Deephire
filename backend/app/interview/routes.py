from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.candidate_session import CandidateSession

from app.resume.parser import extract_text_from_pdf
from app.resume.service import analyze_resume

from app.interview.service import (
    build_interview
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.get("/health")
def interview_health():
    return {
        "status": "ok",
        "module": "interview"
    }


@router.get("/demo")
def interview_demo():
    profile = {
        "skills": [
            "python",
            "fastapi",
            "langgraph",
            "crewai"
        ]
    }

    return build_interview(profile)


@router.get("/session/{session_id}")
def interview_for_session(
    session_id: int,
    db: Session = Depends(get_db)
):

    session = (
        db.query(CandidateSession)
        .filter(
            CandidateSession.id == session_id
        )
        .first()
    )

    if not session or not session.resume_path:
        return {
            "error": "No resume found for this session."
        }

    text = extract_text_from_pdf(
        session.resume_path
    )

    profile = analyze_resume(text)

    return build_interview(profile)