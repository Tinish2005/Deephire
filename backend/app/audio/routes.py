from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends
)

from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.candidate_session import CandidateSession

from app.audio.upload_service import (
    save_audio
)

from app.audio.analytics import (
    analyze_audio
)

router = APIRouter(
    prefix="/audio",
    tags=["Audio"]
)


@router.get("/health")
def audio_health():

    return {
        "status": "ok",
        "module": "audio"
    }


@router.post("/upload")
async def upload_audio(
    audio: UploadFile = File(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):

    path = await save_audio(
        audio
    )

    session = (
        db.query(CandidateSession)
        .filter(CandidateSession.id == session_id)
        .first()
    )

    if session:
        session.audio_path = path
        db.commit()

    return {
        "status": "success",
        "path": path,
        "session_id": session_id
    }


@router.post("/analytics")
async def audio_analytics(
    audio: UploadFile = File(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):

    path = await save_audio(
        audio
    )

    result = analyze_audio(
        path
    )

    session = (
        db.query(CandidateSession)
        .filter(CandidateSession.id == session_id)
        .first()
    )

    if session:
        session.audio_path = path
        db.commit()

    return result