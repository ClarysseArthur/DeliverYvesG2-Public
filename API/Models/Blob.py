import time
from azure.storage.blob import BlobServiceClient
import base64


class Blob:
    def __init__(self, image_base64):
        self.name = str(time.time())
        self.blob_url = f'https://stdeliveryves.blob.core.windows.net/input-data/{self.name}.png'
        self.blob_service_client = BlobServiceClient.from_connection_string('**CONNECTIONSTRING**')
        self.blob_client = self.blob_service_client.get_blob_client(container='input-data', blob=f'{self.name}.png')
        self.blob_client_output = self.blob_service_client.get_blob_client(container='input-data', blob=f'{self.name}_output.jpg')
        self.__output_url = f'https://stdeliveryves.blob.core.windows.net/input-data/{self.name}_output.jpg'

        self.upload_blob(image_base64)

    def upload_blob(self, image_base64):
        self.convert_from_base64(image_base64)

        with open('imageToSave.png', "rb") as data:
            self.blob_client.upload_blob(data)

    def download_blob(self):
        with open('download.png', "wb") as download_file:
            download_file.write(self.blob_client.download_blob().readall())

    def upload_detection(self, image):
        with open(image, "rb") as data:
            self.blob_client_output.upload_blob(data)

    def convert_from_base64(self, image_base64):
        fh = open("imageToSave.png", "wb")
        fh.write(base64.b64decode(image_base64))  # bytes('string', 'utf-8')
        fh.close()

    @staticmethod
    def download_weights():
        # url = "https://stdeliveryves.blob.core.windows.net/weights/bak.pt"
        service_client = BlobServiceClient.from_connection_string('**CONNECTIONSTRING**')
        weight_client = service_client.get_blob_client(container='weights', blob="bak.pt")
        
        with open('bak.pt', "wb") as download_file:
            download_file.write(weight_client.download_blob().readall())

    @property
    def output_url(self):
        return self.__output_url
