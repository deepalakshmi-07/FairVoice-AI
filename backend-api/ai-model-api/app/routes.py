from fastapi import APIRouter
from pydantic import BaseModel
from rejectionModel.utils import predict_status
from categorizationModel.utils import predict_department
from urgencyModel.utils import predict_urgency

# Create a router
router = APIRouter()

# ---- Rejection Model Route ----
# Define the input schema
class PetitionRequest(BaseModel):
    text: str

# Define the response schema (optional)
class PetitionResponse(BaseModel):
    status: str

# Create the prediction route
@router.post("/predict", response_model=PetitionResponse)
async def get_prediction(request: PetitionRequest):
    prediction = predict_status(request.text)
    return {"status": prediction}

# ---- Categorization Model Route ----

class CategoryResponse(BaseModel):
    department: str

@router.post("/predict-department", response_model=CategoryResponse)
async def get_department(request: PetitionRequest):
    """
    Accepts a JSON payload { "text": "<petition text>" }
    Returns { "department": "<predicted department>" }
    """
    department = predict_department(request.text)
    return {"department": department}

# ---- Urgency Detection Model Route ----
class UrgencyRequest(BaseModel):
    text: str

class UrgencyResponse(BaseModel):
    urgency: str

@router.post("/predict-urgency", response_model=UrgencyResponse)
async def get_urgency_prediction(request: UrgencyRequest):
    urgency = predict_urgency(request.text)
    return {"urgency": urgency}

# ---- Repetition Detection Model Route ----



@router.get("/test")
def test_route():
    return {"message": "Test route is working!"}
