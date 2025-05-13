# ai-model-api/repetitionModel/classifier.py
import torch                             # ← ADD THIS
import torch.nn as nn
from transformers import AutoModel

class PetitionSimilarityRegressor(nn.Module):
    def __init__(self):
        super(PetitionSimilarityRegressor, self).__init__()
        # must match your training script
        self.encoder = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        self.regressor = nn.Sequential(
            nn.Linear(self.encoder.config.hidden_size * 2, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
            nn.Sigmoid()
        ) 

    def forward(self, input_ids1, attention_mask1, input_ids2, attention_mask2):
        out1 = self.encoder(input_ids=input_ids1, attention_mask=attention_mask1).last_hidden_state[:, 0, :]
        out2 = self.encoder(input_ids=input_ids2, attention_mask=attention_mask2).last_hidden_state[:, 0, :]
        combined = torch.cat([out1, out2], dim=1)  # torch.cat now works
        return self.regressor(combined).squeeze()
