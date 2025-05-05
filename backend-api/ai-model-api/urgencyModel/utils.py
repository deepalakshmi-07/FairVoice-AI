import torch
from transformers import DistilBertTokenizer
from .classifier import UrgencyClassifier

# 🔹 Load Tokenizer and Model Once
tokenizer = DistilBertTokenizer.from_pretrained(r"E:\AI MODELS\Datasets\Urgency Detection\tokenizer")
num_labels = torch.load(r"E:\AI MODELS\Datasets\Urgency Detection\num_labels_urgency.pth")

label_to_urgency = {
    0: "urgent",
    1: "Not Urgent"
}

model = UrgencyClassifier(num_labels)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.load_state_dict(torch.load(r"E:\AI MODELS\Datasets\Urgency Detection\Urgency_model.pth", map_location=device))
model.to(device)
model.eval()

# 🔹 Prediction Function
def predict_urgency(text: str) -> str:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    inputs = {key: val.to(device) for key, val in inputs.items()}
    with torch.no_grad():
        outputs = model(inputs["input_ids"], inputs["attention_mask"])
    predicted_class = torch.argmax(outputs, dim=1).item()
    return label_to_urgency.get(predicted_class, "Unknown Urgency Level")
