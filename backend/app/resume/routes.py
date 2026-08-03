from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

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
    resume: UploadFile = File(...)
):
    file_path = save_uploaded_resume(resume)

    text = extract_text_from_pdf(file_path)

    profile = analyze_resume(text)

    return {
        "id": 1,
        "filename": resume.filename,
        "profile": profile
    }