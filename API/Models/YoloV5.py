import numpy as np
import torch
from PIL import Image
import os
import re

from Models.Return import Return
import sys
from pathlib import Path
sys.path.append(str(Path(sys.path[0]).parent) + "\yolov5_obb")


class YoloV5:
    runs = 0

    def __init__(self):
        self.model_bottle = torch.hub.load(
            '/yolov5_obb', 'custom', path="best.pt", source='local', device='cpu')
        self.model_bottle.conf = 0.6
        self.model_bottle.iou = 0.3

        self.model_crate = torch.hub.load(
            '/yolov5_obb', 'custom', path="bak.pt", source='local', device='cpu')
        self.model_crate.conf = 0.5

    def detect_crate(self, blob):
        img = Image.open('imageToSave.png')

        result_crate = self.model_crate(img, size=1280)
        # result_crate.save()

        crates = np.array(result_crate.pandas().xyxyn[0])

        bak_list = []

        for i, x in enumerate(crates):
            if x[5] == 0:
                bak_list.append(crates[i])

        result_bottle = self.model_bottle(img, size=1280)
        result_bottle.save()

        bottles = np.array(result_bottle.pandas().xyxyn[0])

        bottles_in_crate = self.detect_bottles_in_crate(bak_list, bottles)

        self.upload(blob)

        # print("")
        # print(crates)
        # print("")
        # print(bottles)
        # print("")

        return Return(blob.output_url, bottles_in_crate)

    def detect_bottles_in_crate(self, bak_list, arr):
        all_bak_bottle_list = []

        for x in bak_list:
            xmin = x[0]
            ymin = x[1]
            xmax = x[2]
            ymax = x[3]

            bak_bottle_list = []

            for x in arr:
                avgx = (x[0] + x[2])/2
                avgy = (x[1] + x[3])/2
                if avgx > xmin and avgx < xmax and avgy > ymin and avgy < ymax:
                    bak_bottle_list.append(x.tolist())

            all_bak_bottle_list.append(bak_bottle_list)

        return all_bak_bottle_list

    def upload(self, blob):
        subdirectories = []
        for file in os.listdir('runs/detect'):
            d = os.path.join('runs/detect', file)
            if os.path.isdir(d):
                subdirectories.append(str(d))

        directory_numbers = []
        for x in subdirectories:
            num = re.findall("[0-9999]", x)
            if len(num) > 0:
                number = ''
                for y in num:
                    number += str(y)
                directory_numbers.append(int(number))

        directory = ''

        if len(directory_numbers) == 0:
            directory = 'runs/detect/exp/imageToSave.jpg'
        else:
            directory_number = max(directory_numbers)
            directory = 'runs/detect/exp' + \
                str(directory_number) + '/imageToSave.jpg'

        blob.upload_detection(directory)
