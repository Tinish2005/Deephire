from fastapi import FastAPI

from app.auth.routes import router as auth_router

app = FastAPI(
    title="DeepHire",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "project": "DeepHire",
        "status": "running"
    }