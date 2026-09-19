from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.final_report import FinalReport
from app.models.candidate_session import CandidateSession

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

import os

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/")
def get_all_reports(
    db: Session = Depends(get_db)
):

    return (
        db.query(FinalReport)
        .order_by(
            FinalReport.id.desc()
        )
        .all()
    )


@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(FinalReport)
        .filter(
            FinalReport.id == report_id
        )
        .first()
    )


@router.get("/{report_id}/export/json")
def export_report_json(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(FinalReport)
        .filter(
            FinalReport.id == report_id
        )
        .first()
    )

    if not report:
        return JSONResponse(
            status_code=404,
            content={"error": "Report not found."}
        )

    session = (
        db.query(CandidateSession)
        .filter(
            CandidateSession.id == report.session_id
        )
        .first()
    )

    return {
        "report_id": report.id,
        "session_id": report.session_id,
        "candidate_name": session.candidate_name if session else "Unknown",
        "email": session.email if session else None,
        "overall_score": report.overall_score,
        "recommendation": report.recommendation,
        "strengths": report.strengths,
        "weaknesses": report.weaknesses,
    }


@router.get("/{report_id}/export/pdf")
def export_report_pdf(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = (
        db.query(FinalReport)
        .filter(
            FinalReport.id == report_id
        )
        .first()
    )

    if not report:
        return JSONResponse(
            status_code=404,
            content={"error": "Report not found."}
        )

    session = (
        db.query(CandidateSession)
        .filter(
            CandidateSession.id == report.session_id
        )
        .first()
    )

    candidate_name = session.candidate_name if session else "Unknown"

    export_dir = "app/exports"
    os.makedirs(export_dir, exist_ok=True)

    file_path = f"{export_dir}/report_{report_id}.pdf"

    c = canvas.Canvas(file_path, pagesize=letter)

    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, 750, "DeepHire — Candidate Assessment Report")

    c.setFont("Helvetica", 12)
    c.drawString(72, 710, f"Candidate: {candidate_name}")
    c.drawString(72, 690, f"Session ID: {report.session_id}")

    c.setFont("Helvetica-Bold", 14)
    c.drawString(72, 650, f"Overall Score: {report.overall_score}")
    c.drawString(72, 630, f"Recommendation: {report.recommendation}")

    c.setFont("Helvetica", 12)
    c.drawString(72, 590, f"Strengths: {report.strengths}")
    c.drawString(72, 570, f"Weaknesses: {report.weaknesses}")

    c.save()

    return FileResponse(
        path=file_path,
        filename=f"DeepHire_Report_{report_id}.pdf",
        media_type="application/pdf"
    )