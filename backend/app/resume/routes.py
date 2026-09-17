from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Form
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.candidate_session import CandidateSession

from app.resume.upload_service import save_uploaded_resume
from app.resume.parser import extract_text_from_pdf
from app.resume.service import analyze_resume

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.get("/health")
def resume_health():
    return {
        "status": "ok",
        "module": "resume"
    }


@router.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    session_id: int = Form(...),
    db: Session = Depends(get_db)
):
    file_path = save_uploaded_resume(resume)

    text = extract_text_from_pdf(file_path)

    profile = analyze_resume(text)

    session = (
        db.query(CandidateSession)
        .filter(CandidateSession.id == session_id)
        .first()
    )

    if session:
        session.resume_path = file_path
        db.commit()

    return {
        "id": 1,
        "filename": resume.filename,
        "profile": profile,
        "session_id": session_id
    }