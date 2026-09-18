from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.candidate_session import (
    CandidateSession
)
from app.models.session_answer import (
    SessionAnswer
)

from app.schemas.candidate_session import (
    CandidateSessionCreate,
    CandidateSessionResponse,
    SessionAnswerUpdate
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


@router.post("/{session_id}/answer")
def save_answer(
    session_id: int,
    data: SessionAnswerUpdate,
    db: Session = Depends(get_db)
):

    answer = SessionAnswer(
        session_id=session_id,
        question_text=data.question_text,
        expected_answer=data.expected_answer,
        candidate_answer=data.candidate_answer
    )

    db.add(answer)

    db.commit()

    db.refresh(answer)

    return answer


@router.get("/{session_id}/answers")
def get_answers(
    session_id: int,
    db: Session = Depends(get_db)
):

    answers = (
        db.query(SessionAnswer)
        .filter(
            SessionAnswer.session_id == session_id
        )
        .all()
    )

    return answers


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