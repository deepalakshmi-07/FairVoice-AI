
import torch
import torch.nn as nn
from transformers import DistilBertModel

class PetitionClassifier(nn.Module):
    def __init__(self, num_labels: int):
        super(PetitionClassifier, self).__init__()
        # Load pre-trained DistilBERT
        self.bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
        # A small classifier on top of [CLS] token
        hidden_size = self.bert.config.hidden_size
        self.pre_classifier = nn.Linear(hidden_size, 256)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.classifier = nn.Linear(256, num_labels)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, input_ids, attention_mask):
        # BERT forward
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        # Take [CLS] token representation
        pooled_output = outputs.last_hidden_state[:, 0, :]
        # Classification head
        x = self.pre_classifier(pooled_output)
        x = self.relu(x)
        x = self.dropout(x)
        logits = self.classifier(x)
        return self.softmax(logits)