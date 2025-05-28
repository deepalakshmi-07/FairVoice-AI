# ai-model-api/repetitionModel/utils.py
import torch
from transformers import AutoTokenizer
from .classifier import PetitionSimilarityRegressor
from typing import List

# Paths to your saved model & tokenizer
MODEL_PATH     = r"E:\AI MODELS\Datasets\Repetitive Model\repetition_model_miniLM.pth"
TOKENIZER_PATH = r"E:\AI MODELS\Datasets\Repetitive Model\repetition_tokenizer_miniLM"

# 1) Load tokenizer & model once at startup
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_PATH)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = PetitionSimilarityRegressor()
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

def predict_repetition(new_title: str, existing_titles: List[str], threshold: float = 0.5):
    """
    Compare new_title against existing_titles.
    Returns:
      is_repetitive: bool
      duplicate_indices: List[int]  # positions in existing_titles
    """
    # ─────────────────────────────────────────────────────────────
    # GUARD: if no existing titles, skip tokenization & return false
    if not existing_titles:
        return {
            "is_repetitive": False,
            "duplicate_indices": []
        }
    # ─────────────────────────────────────────────────────────────

    
    # Batch‐tokenize
    inputs_new = tokenizer([new_title] * len(existing_titles),
                           truncation=True, padding=True, max_length=128, return_tensors="pt")
    inputs_old = tokenizer(existing_titles,
                           truncation=True, padding=True, max_length=128, return_tensors="pt")

    # Move to device
    for d in (inputs_new, inputs_old):
        for k, v in d.items():
            d[k] = v.to(device)

    # Predict similarity scores
    with torch.no_grad():
        scores = model(
            inputs_new["input_ids"], inputs_new["attention_mask"],
            inputs_old["input_ids"], inputs_old["attention_mask"]
        ).cpu().tolist()

    # Find duplicates
    duplicate_indices = [i for i, s in enumerate(scores) if s >= threshold]
    return {
        "is_repetitive": len(duplicate_indices) > 0,
        "duplicate_indices": duplicate_indices
    }
