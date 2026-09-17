from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.resume.routes import router as resume_router
from app.interview.routes import router as interview_router

from app.evaluation.routes import (
    router as evaluation_router
)

from app.audio.routes import (
    router as audio_router
)
from app.api.assessment_routes import (
    router as assessment_router
)

from app.vision.routes import (
    router as vision_router
)

from app.fusion.routes import (
    router as fusion_router
)

from app.nlp.routes import (
    router as nlp_router
)

from app.api.session_routes import (
    router as session_router
)

from app.database.base import Base
from app.database.sqlite_session import engine
from app.api.report_routes import (
    router as report_router
)

app = FastAPI(
    title="DeepHire",
    version="1.0.0"
)

Base.metadata.create_all(
    bind=engine
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

app.include_router(resume_router)

app.include_router(interview_router)

app.include_router(
    evaluation_router
)

app.include_router(
    audio_router
)

app.include_router(
    vision_router
)

app.include_router(
    fusion_router
)

app.include_router(
    session_router
)
app.include_router(
    assessment_router
)
app.include_router(
    report_router
)

app.include_router(
    nlp_router
)


@app.get("/")
def root():
    return {
        "project": "DeepHire",
        "status": "running"
    }