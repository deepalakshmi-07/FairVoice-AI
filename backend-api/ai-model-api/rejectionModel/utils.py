import torch
from transformers import DistilBertTokenizer
from .classifier import PetitionClassifier

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Paths to model and tokenizer
MODEL_PATH = r"E:\AI MODELS\Datasets\Rejection Model\petition_model.pth"
TOKENIZER_PATH = r"E:\AI MODELS\Datasets\Rejection Model\tokenizer"
NUM_LABELS_PATH = r"E:\AI MODELS\Datasets\Rejection Model\num_labels.pth"

# Load tokenizer and number of labels
tokenizer = DistilBertTokenizer.from_pretrained(TOKENIZER_PATH)
num_labels = torch.load(NUM_LABELS_PATH)

# Load model
model = PetitionClassifier(num_labels)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# Label mapping
label_to_status = {
    0: "Approved",
    1: "Rejected"
}

# Predict function
def predict_status(text: str) -> str:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    with torch.no_grad():
        outputs = model(inputs["input_ids"], inputs["attention_mask"])
        predicted_class = torch.argmax(outputs, dim=1).item()

    return label_to_status.get(predicted_class, "Unknown")
