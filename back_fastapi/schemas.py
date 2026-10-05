from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class ConsultRequest(BaseModel):
    question: str
    history: list[Message] = []


class ConsultResponse(BaseModel):
    answer: str
