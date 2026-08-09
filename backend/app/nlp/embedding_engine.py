from sentence_transformers import SentenceTransformer

_model = None


def get_model():
    global _model

    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


def generate_embedding(
    text: str
):
    text = text.strip()

    if len(text) == 0:
        return {
            "embedding": None,
            "dimension": 0,
            "error": "Empty text provided."
        }

    model = get_model()

    vector = model.encode(text)

    return {
        "embedding": vector.tolist(),
        "dimension": len(vector),
        "model": "all-MiniLM-L6-v2"
    }