from datetime import datetime

from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class FinalReport(Base):

    __tablename__ = "final_reports"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    session_id: Mapped[int] = mapped_column()

    overall_score: Mapped[float] = mapped_column(
        Float
    )

    recommendation: Mapped[str] = mapped_column(
        String(100)
    )

    strengths: Mapped[str] = mapped_column(
        String(1000)
    )

    weaknesses: Mapped[str] = mapped_column(
        String(1000)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )