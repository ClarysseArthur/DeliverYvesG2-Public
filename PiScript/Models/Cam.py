import cv2
import base64

class Cam:
    def __init__(self, cam_number):
        self.cam_number = cam_number
        self.__encoded_image = ''

    def take_picture(self):
        cap = cv2.VideoCapture(self.cam_number)
        ret, frame = cap.read()
        #cv2.imwrite('/home/pi/Desktop/image.jpg', frame)
        cap.release()
        self.convert_img_to_base64(frame)

    def convert_img_to_base64(self, image):
        # save image to file
        cv2.imwrite(f'/home/pi/image{self.cam_number}.png', image)

        # convert /home/pi/image{self.cam_number}.png to base64
        with open(f'/home/pi/image{self.cam_number}.png', "rb") as image_file:
            self.__encoded_image = str(base64.b64encode(image_file.read()))


    @property
    def encoded_image(self):
        return self.__encoded_image