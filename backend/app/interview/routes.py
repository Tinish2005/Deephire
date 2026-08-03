from fastapi import APIRouter

from app.interview.service import (
    build_interview
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.get("/health")
def interview_health():
    return {
        "status": "ok",
        "module": "interview"
    }


@router.get("/demo")
def interview_demo():
    profile = {
    "skills": [
        "python",
        "fastapi",
        "langgraph",
        "crewai"
    ]
}
    

    return build_interview(profile)