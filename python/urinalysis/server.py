from flask import Flask, request
import python.urinalysis.urinalysis as urinalysis

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Urinalysis Backend</p>"

@app.route("/api/analyse", methods=['POST'])
def send_analysis():
    if request.is_json:
        req = request.get_json()
        print(req)
        #reassigning data for testing
        #data = [[1.025, 5.2, 856, 28.5, 380, 7.2]]
        #data = [[1.018, 5.5, 680, 22.0, 320, 4.5]]
        response = urinalysis.analyse(req['data']);
        return {"response" : response}, 200
    else:
        return {"error" : "no json data received"}, 400
    
