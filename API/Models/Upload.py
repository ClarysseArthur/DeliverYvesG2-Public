from pydantic import BaseModel

class Upload(BaseModel):
    image_base64: str