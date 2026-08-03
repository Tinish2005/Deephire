import os
from fastapi import UploadFile


UPLOAD_DIR = "app/uploads"


def save_uploaded_resume(file: UploadFile):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return file_path