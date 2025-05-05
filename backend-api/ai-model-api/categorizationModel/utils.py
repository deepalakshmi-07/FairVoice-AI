
import torch
from transformers import DistilBertTokenizer
from .classifier import PetitionClassifier

# Adjust these paths as needed
TOKENIZER_PATH = r"E:\AI MODELS\Datasets\Categorization model\tokenizer"
MODEL_PATH     = r"E:\AI MODELS\Datasets\Categorization model\petition_model.pth"
LABELS_PATH    = r"E:\AI MODELS\Datasets\Categorization model\num_labels.pth"

# Mapping from label index to department name
label_to_category = {
    0: "Education",
    1: "Health",
    2: "Infrastructure",
    3: "Law and Order",
    4: "Social Welfare"
}

# Load tokenizer
tokenizer = DistilBertTokenizer.from_pretrained(TOKENIZER_PATH)

# Load number of labels
num_labels = torch.load(LABELS_PATH)

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize and load model
model = PetitionClassifier(num_labels)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()


def predict_department(text: str) -> str:
    """
    Tokenizes the input text, runs it through the model,
    and returns the department name.
    """
    # Encode text
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    # Move tensors to device
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Inference
    with torch.no_grad():
        outputs = model(inputs["input_ids"], inputs["attention_mask"])
    # Get predicted label index
    pred_idx = torch.argmax(outputs, dim=1).item()
    # Map to department name
    return label_to_category.get(pred_idx, "Unknown Department")
