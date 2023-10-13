# Same as main.py
# but with CORS enabled
import json, generator, datetime, functions

# API server librarys
from flask import Flask
#from flask import request
#from flask_restful import Resource, Api, reqparse
from flask_cors import CORS, cross_origin

#return json.dumps(r), s

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def _info1():
    r,s = functions.info()
    return r, s

@app.route("/help", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def _info2():
    r,s = functions.info()
    return r, s

@app.route("/info", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def _info3():
    r,s = functions.info()
    return r, s

@app.route("/forecast/today", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def today():
    # return weather
    r, s = functions.today()
    return r, s

@app.route("/forecast/now", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def now():
    # return weather for the current day and hour
    r, s = functions.now()
    return r,s

@app.route("/forecast/day", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def day():
    # return weather for a specified day
    r, s = functions.day()
    return r,s

@app.route("/forecast/range", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def ranging():
    # return weather data for days in a range
    r,s = functions.ranging()
    return r, s

@app.route("/forecast/week", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def week():
    # return weather data for a week
    r,s = functions.week()
    return r, s

@app.route("/forecast/month", methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type',"Authorization"])
def month():
    # return weather data for a week
    r,s = functions.month()
    return r, s

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)  # run Flask app