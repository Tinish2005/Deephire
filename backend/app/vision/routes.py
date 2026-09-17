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

from app.vision.face_detector import (
    detect_faces
)

from app.vision.upload_service import (
    save_frame
)
from app.vision.attention_analyzer import (
    analyze_attention
)

router = APIRouter(
    prefix="/vision",
    tags=["Vision"]
)


@router.get("/health")
def vision_health():

    return {
        "status": "ok",
        "module": "vision"
    }


@router.post("/upload")
async def upload_frame(
    image: UploadFile = File(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):

    path = await save_frame(
        image
    )

    session = (
        db.query(CandidateSession)
        .filter(CandidateSession.id == session_id)
        .first()
    )

    if session:
        session.vision_image_path = path
        db.commit()

    return {
        "status": "success",
        "path": path,
        "session_id": session_id
    }

@router.post("/detect-face")
async def detect_face(
    image: UploadFile = File(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):

    path = await save_frame(
        image
    )

    result = detect_faces(
        path
    )

    session = (
        db.query(CandidateSession)
        .filter(CandidateSession.id == session_id)
        .first()
    )

    if session:
        session.vision_image_path = path
        db.commit()

    return result

@router.post("/attention")
async def attention(
    image: UploadFile = File(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):

    path = await save_frame(
        image
    )

    result = analyze_attention(
        path
    )

    session = (
        db.query(CandidateSession)
        .filter(CandidateSession.id == session_id)
        .first()
    )

    if session:
        session.vision_image_path = path
        db.commit()

    return result