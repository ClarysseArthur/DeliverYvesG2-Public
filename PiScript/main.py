from fastapi import FastAPI
from Models.Cam import Cam
import uvicorn
from Models.Web import Web

app = FastAPI()

@app.get("/")
def read_root():
    web = Web()

    for x in range(0, 7, 2):
        cam = Cam(x)
        cam.take_picture()
        web.send_request(cam.encoded_image)
        
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)