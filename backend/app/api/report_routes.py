from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.final_report import FinalReport

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