from pydantic import BaseModel


class AssessmentRequest(BaseModel):

    session_id: int


class AssessmentResponse(BaseModel):

    session_id: int

    resume_score: float

    interview_score: float

    voice_score: float

    vision_score: float

    overall_score: float

    recommendation: str

    explanation: dict

    report_id: int


class ReportResponse(BaseModel):

    id: int

    session_id: int

    overall_score: float

    recommendation: str

    strengths: str

    weaknesses: str

    class Config:

        from_attributes = True