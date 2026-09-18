from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import ForeignKey

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class SessionAnswer(Base):

    __tablename__ = "session_answers"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    session_id: Mapped[int] = mapped_column(
        ForeignKey("candidate_sessions.id")
    )

    question_text: Mapped[str] = mapped_column(
        String(1000)
    )

    expected_answer: Mapped[str] = mapped_column(
        String(2000),
        nullable=True
    )

    candidate_answer: Mapped[str] = mapped_column(
        String(2000)
    )