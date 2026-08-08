import os


def analyze_audio(file_path: str):

    file_size = os.path.getsize(file_path)

    duration_seconds = round(
        file_size / 16000,
        2
    )

    estimated_wpm = round(
        duration_seconds * 2
    )

    return {
        "file_size_bytes": file_size,
        "duration_seconds": duration_seconds,
        "estimated_wpm": estimated_wpm
    }