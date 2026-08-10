from pydantic import BaseModel
from datetime import datetime


class CandidateSessionCreate(BaseModel):

    candidate_name: str

    email: str | None = None


class CandidateSessionResponse(BaseModel):

    id: int

    candidate_name: str

    email: str | None

    created_at: datetime

    class Config:

        from_attributes = True