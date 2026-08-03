from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        default=1
    )

    filename: Mapped[str] = mapped_column(
        String(255)
    )

    raw_text: Mapped[str] = mapped_column(
        Text
    )

    skills: Mapped[str] = mapped_column(
        Text
    )

    projects: Mapped[str] = mapped_column(
        Text
    )

    experience: Mapped[str] = mapped_column(
        Text
    )