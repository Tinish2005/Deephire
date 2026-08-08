import cv2


def detect_faces(image_path: str):

    image = cv2.imread(image_path)

    if image is None:
        return {
            "face_detected": False,
            "face_count": 0
        }

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades +
        "haarcascade_frontalface_default.xml"
    )

    if cascade.empty():

        return {
            "face_detected": False,
            "face_count": 0,
            "error":
                "Haar cascade not loaded"
        }

    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    return {
        "face_detected":
            len(faces) > 0,

        "face_count":
            len(faces)
    }