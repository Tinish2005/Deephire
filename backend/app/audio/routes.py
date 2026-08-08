from fastapi import (
    APIRouter,
    UploadFile,
    File
)

from app.audio.upload_service import (
    save_audio
)

from app.audio.analytics import (
    analyze_audio
)

router = APIRouter(
    prefix="/audio",
    tags=["Audio"]
)


@router.get("/health")
def audio_health():

    return {
        "status": "ok",
        "module": "audio"
    }


@router.post("/upload")
async def upload_audio(
    audio: UploadFile = File(...)
):

    path = await save_audio(
        audio
    )

    return {
        "status": "success",
        "path": path
    }


@router.post("/analytics")
async def audio_analytics(
    audio: UploadFile = File(...)
):

    path = await save_audio(
        audio
    )

    result = analyze_audio(
        path
    )

    return result