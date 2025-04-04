import torch
import torch.nn as nn
from transformers import DistilBertTokenizer, DistilBertModel
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
# Load Tokenizer & Model
tokenizer = DistilBertTokenizer.from_pretrained(r"E:\FINAL YEAR PROJECT TECHNOVATE\DataSet\tokenizer")
num_labels = torch.load(r"E:\FINAL YEAR PROJECT TECHNOVATE\DataSet\num_labels.pth")

# Department Mapping
label_to_category = {
    0: "Education",
    1: "Health",
    2: "Infrastructure",
    3: "Law and Order",
    4: "Social Welfare"
}

# Define Model Class
class PetitionClassifier(nn.Module):
    def __init__(self, num_labels):
        super(PetitionClassifier, self).__init__()
        self.bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
        self.pre_classifier = nn.Linear(self.bert.config.hidden_size, 256)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.classifier = nn.Linear(256, num_labels)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.last_hidden_state[:, 0, :]
        pooled_output = self.pre_classifier(pooled_output)
        pooled_output = self.relu(pooled_output)
        pooled_output = self.dropout(pooled_output)
        logits = self.classifier(pooled_output)
        return self.softmax(logits)

# Load Model
model = PetitionClassifier(num_labels)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.load_state_dict(torch.load(r"E:\FINAL YEAR PROJECT TECHNOVATE\DataSet\petition_model.pth", map_location=device))
model.to(device)
model.eval()

# Request Body
class PetitionRequest(BaseModel):
    text: str

# Root Endpoint (Fixes 404 Not Found)
@app.get("/")
async def root():
    return {"message": "Welcome to the Petition Categorization API!"}

# Prediction Endpoint
@app.post("/predict")
async def predict_petition(data: PetitionRequest):
    if not data.text.strip():
        return {"error": "Petition text cannot be empty."}

    inputs = tokenizer(data.text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    with torch.no_grad():
        outputs = model(inputs["input_ids"], inputs["attention_mask"])

    predicted_class = torch.argmax(outputs, dim=1).item()
    department_name = label_to_category.get(predicted_class, "Unknown Department")
    
    return {"department": department_name}

# Run the API (For local testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
