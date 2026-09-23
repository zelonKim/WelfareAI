from pydantic import BaseModel

class ConsultRequest(BaseModel):
    question: str

class ConsultResponse(BaseModel):
    answer: str
