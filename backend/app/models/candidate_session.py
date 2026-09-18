from datetime import datetime

from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Float

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class CandidateSession(Base):

    __tablename__ = "candidate_sessions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )
    resume_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    candidate_name: Mapped[str] = mapped_column(
        String(200)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    resume_path: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    audio_path: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    vision_image_path: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    question_text: Mapped[str] = mapped_column(
        String(1000),
        nullable=True
    )

    expected_answer: Mapped[str] = mapped_column(
        String(2000),
        nullable=True
    )

    candidate_answer: Mapped[str] = mapped_column(
        String(2000),
        nullable=True
    )
    resume_score: Mapped[float] = mapped_column(
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )