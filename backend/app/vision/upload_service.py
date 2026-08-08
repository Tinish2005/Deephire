import os

from fastapi import UploadFile

UPLOAD_DIR = "app/vision/uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


async def save_frame(
    image: UploadFile
):

    file_path = os.path.join(
        UPLOAD_DIR,
        image.filename
    )

    content = await image.read()

    with open(
        file_path,
        "wb"
    ) as file:

        file.write(content)

    return file_path