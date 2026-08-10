from datetime import datetime

from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class CandidateSession(Base):

    __tablename__ = "candidate_sessions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    candidate_name: Mapped[str] = mapped_column(
        String(200)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )