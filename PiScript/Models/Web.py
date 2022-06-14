import http.client
import json
import jsonpickle

class Web:
    def __init__(self):
        pass

    def send_request(self, data):
        conn = http.client.HTTPSConnection("api.dyg2.be")
        payload = '{"image_base64": "' + data[data.find("'")+1: data.rfind("'")] +'"}'

        # print payload to file
        with open("bottles.json", "w") as f:
            f.write(payload)
        f.close()

        headers = {'Content-Type': 'application/json'}
        conn.request("POST", "/detectbottles", payload, headers)
        res = conn.getresponse()
        out = res.read()
        print(out.decode("utf-8"))

        return jsonpickle.decode(out.decode("utf-8"))