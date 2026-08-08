import os
from fastapi import UploadFile

UPLOAD_DIR = "app/audio/uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


async def save_audio(
    audio: UploadFile
):

    file_path = os.path.join(
        UPLOAD_DIR,
        audio.filename
    )

    content = await audio.read()

    with open(
        file_path,
        "wb"
    ) as file:

        file.write(content)

    return file_path