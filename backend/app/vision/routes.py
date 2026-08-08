from fastapi import (
    APIRouter,
    UploadFile,
    File
)
from app.vision.face_detector import (
    detect_faces
)

from app.vision.upload_service import (
    save_frame
)
from app.vision.attention_analyzer import (
    analyze_attention
)

router = APIRouter(
    prefix="/vision",
    tags=["Vision"]
)


@router.get("/health")
def vision_health():

    return {
        "status": "ok",
        "module": "vision"
    }


@router.post("/upload")
async def upload_frame(
    image: UploadFile = File(...)
):

    path = await save_frame(
        image
    )

    return {
        "status": "success",
        "path": path
    }

@router.post("/detect-face")
async def detect_face(
    image: UploadFile = File(...)
):

    path = await save_frame(
        image
    )

    result = detect_faces(
        path
    )

    return result
@router.post("/attention")
async def attention(
    image: UploadFile = File(...)
):

    path = await save_frame(
        image
    )

    result = analyze_attention(
        path
    )

    return result