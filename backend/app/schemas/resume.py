from pydantic import BaseModel


class ResumeResponse(BaseModel):
    filename: str
    skills: list[str]
    projects: list[str]
    experience: list[str]


class ResumeProfile(BaseModel):
    skills: list[str]
    projects: list[str]
    experience: list[str]