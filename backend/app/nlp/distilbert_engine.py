import torch
from transformers import DistilBertTokenizer, DistilBertModel

_tokenizer = None
_model = None


def get_distilbert():
    global _tokenizer, _model

    if _tokenizer is None or _model is None:
        _tokenizer = DistilBertTokenizer.from_pretrained(
            "distilbert-base-uncased"
        )
        _model = DistilBertModel.from_pretrained(
            "distilbert-base-uncased"
        )
        _model.eval()

    return _tokenizer, _model


def evaluate_answer_distilbert(
    answer: str
):
    answer = answer.strip()

    if len(answer) == 0:
        return {
            "ai_evaluation_score": 0.0,
            "error": "Empty answer provided."
        }

    tokenizer, model = get_distilbert()

    inputs = tokenizer(
        answer,
        return_tensors="pt",
        truncation=True,
        max_length=256
    )

    with torch.no_grad():
        outputs = model(**inputs)

    hidden_states = outputs.last_hidden_state[0]

    mean_pooled = torch.mean(
        hidden_states,
        dim=0
    )
    embedding_norm = torch.norm(
        mean_pooled
    ).item()

    token_diversity = torch.std(
        hidden_states,
        dim=0
    ).mean().item()

    token_count = inputs["input_ids"].shape[1]
    length_score = min(
        token_count / 60,
        1.0
    )

    norm_score = min(
        embedding_norm / 15,
        1.0
    )

    diversity_score = min(
        token_diversity / 2,
        1.0
    )

    final_score = (
        (length_score * 0.3) +
        (norm_score * 0.35) +
        (diversity_score * 0.35)
    ) * 100

    return {
        "ai_evaluation_score": round(final_score, 2),
        "token_count": token_count,
        "embedding_norm": round(embedding_norm, 4),
        "token_diversity": round(token_diversity, 4),
        "model": "distilbert-base-uncased"
    }