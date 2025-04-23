from fastapi import APIRouter
from pydantic import BaseModel
from rejectionModel.utils import predict_status

# Create a router
router = APIRouter()

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


@router.get("/test")
def test_route():
    return {"message": "Test route is working!"}
