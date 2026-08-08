import cv2


def analyze_attention(
    image_path: str
):

    image = cv2.imread(
        image_path
    )

    if image is None:

        return {
            "attention_score": 0
        }

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades +
        "haarcascade_frontalface_default.xml"
    )

    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    if len(faces) == 0:

        return {
            "attention_score": 0,
            "face_detected": False
        }

    x, y, w, h = faces[0]

    image_center_x = image.shape[1] / 2

    face_center_x = x + (w / 2)

    distance = abs(
        image_center_x -
        face_center_x
    )

    score = max(
        0,
        100 - int(distance / 5)
    )

    return {
        "face_detected": True,
        "face_count": len(faces),
        "attention_score": score
    }