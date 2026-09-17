import os

from app.audio.transcriber import (
    transcribe_audio
)


def analyze_audio(file_path: str):

    file_size = os.path.getsize(file_path)

    transcript = transcribe_audio(
        file_path
    )

    word_count = len(
        transcript.split()
    )

    duration_seconds = round(
        file_size / 16000,
        2
    )

    if duration_seconds > 0:
        speaking_rate_wpm = round(
            (word_count / duration_seconds) * 60,
            2
        )
    else:
        speaking_rate_wpm = 0

    filler_words = [
        "um", "uh", "like", "you know",
        "actually", "basically", "so"
    ]

    transcript_lower = transcript.lower()

    filler_count = sum(
        transcript_lower.count(filler)
        for filler in filler_words
    )

    clarity_score = max(
        0,
        min(
            100,
            100 - (filler_count * 5)
        )
    )

    if 110 <= speaking_rate_wpm <= 160:
        pace_score = 100
    elif speaking_rate_wpm < 110:
        pace_score = max(
            0,
            100 - (110 - speaking_rate_wpm)
        )
    else:
        pace_score = max(
            0,
            100 - (speaking_rate_wpm - 160)
        )

    voice_score = round(
        (clarity_score * 0.5) + (pace_score * 0.5),
        2
    )

    return {
        "transcript": transcript,
        "word_count": word_count,
        "duration_seconds": duration_seconds,
        "speaking_rate_wpm": speaking_rate_wpm,
        "filler_word_count": filler_count,
        "clarity_score": clarity_score,
        "pace_score": pace_score,
        "voice_score": voice_score
    }