
#! Dependencies
#? Libraries
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
import jsonpickle
import uvicorn
import json

#? Custom imports
from Models.Blob import Blob
from Models.YoloV5 import YoloV5
from Models.Upload import Upload

#! App config
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#! Download Weights
Blob.download_weights()

#! Global objects
yolo = YoloV5()


#! Routes
#? Root - test
@app.get("/")
async def root():
    return {"message": "Hello World"}

#? Detect crates and bottles
@app.post('/detectbottles')
async def detectcrate(upload: Upload):
    blob = Blob(upload.image_base64)
    return jsonpickle.encode(yolo.detect_crate(blob))

#! App run
if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
