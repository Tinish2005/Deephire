from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.candidate_session import (
    CandidateSession
)

from app.schemas.candidate_session import (
    CandidateSessionCreate,
    CandidateSessionResponse
)

router = APIRouter(
    prefix="/session",
    tags=["Session Management"]
)


@router.post(
    "/create",
    response_model=CandidateSessionResponse
)
def create_session(
    data: CandidateSessionCreate,
    db: Session = Depends(get_db)
):

    session = CandidateSession(
        candidate_name=data.candidate_name,
        email=data.email
    )

    db.add(session)

    db.commit()

    db.refresh(session)

    return session


@router.get("/{session_id}")
def get_session(
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

    return session

@router.get("/history/all")
def get_all_sessions(
    db: Session = Depends(get_db)
):

    sessions = (
        db.query(CandidateSession)
        .order_by(
            CandidateSession.id.desc()
        )
        .all()
    )

    return sessions