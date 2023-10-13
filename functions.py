import generator, datetime,sys,os, time
from flask import request

info_msg = {
    "name": "Random Forecast API",
    "description": "Generates random forecasts",
    "author": "JuNi7",
    "available_paths": {
        "/": "Shows this message",
        "/info": "Shows this message",
        "/help": "Shows this message",
        "/forecast/today": "Shows the forecast for today (server time)",
        "/forecast/now": "Shows the current forecast (server time)",
        "/forecast/day": "Shows the forecast for a specified day",
        "/forecast/range": "Shows the forecast for from a specified day to another",
        "/forecast/week": "Shows the forecast for a week"
    },
    "server_time": 0
}

def info():
    info_msg["server_time"] = time.time()
    return (info_msg,200)

def today():
    # get arguments
    args = request.args
    # get current time
    t = datetime.datetime.now()
    # check for an applied time correction
    if "time_correction" in args:
        a = datetime.timedelta(hours=int(args["time_correction"]))
        t += a

    return generator.generateWeatherOneDay(t), 200

def now():
    # get arguments
    args = request.args
    # get current time
    t = datetime.datetime.now()
    # check for an applied time correction
    if "time_correction" in args:
        a = datetime.timedelta(hours=int(args["time_correction"]))
        t += a

    rmonth = False
    if "rmonth" in args:
        rmonth = True

    return generator.generateWeatherOneHour(t, t.hour,rmonth), 200

def day():
    # get arguments
    args = request.args
    # get day
    if "date" in args:
        day = args["date"]
    else:
        return {"error":"no date specified. Add ?date=YYYY-MM-DD"}, 1
    
    day = day.split("-")

    rmonth = False
    if "rmonth" in args:
        rmonth = True
    
    try:
        return generator.generateWeatherOneDay(datetime.datetime( int(day[0]), int(day[1]), int(day[2]) ),rmonth), 200
    except Exception as e:
        print("Inputted date: "+args["date"])
        print("Error        : "+str(e))
        raise e
        return {"error": "internal server error", "error_message":str(e),"date":args["date"]}, 2

def ranging():
    # get arguments
    args = request.args
    # get start date
    if "start_date" in args:
        start_date = args["start_date"]
    else:
        if not "end_date" in args:
            return {"error":"missing arguments","error1":"no start date specified. Add ?start_date=YYYY-MM-DD","error2":"no end date specified. Add ?end_date=YYYY-MM-DD"}, 1
        else:
            return {"error":"no start date specified. Add ?start_date=YYYY-MM-DD"}, 1
    
    start_date = start_date.split("-")

    # get end date
    if "end_date" in args:
        end_date = args["end_date"]
    else:
        return {"error":"no end date specified. Add ?end_date=YYYY-MM-DD"}, 1
    
    end_date = end_date.split("-")

    rmonth = False
    if "rmonth" in args:
        rmonth = True
    
    # genrate and return
    try:
        start_date = datetime.datetime( int(start_date[0]), int(start_date[1]), int(start_date[2]) )
        end_date = datetime.datetime( int(end_date[0]), int(end_date[1]), int(end_date[2]) )
        return generator.generateWeatherInTimeRange(start_date, end_date, rmonth), 200
    except Exception as e:
        # return error
        print("Inputted start date: "+args["start_date"])
        print("Inputted end   date: "+args["end_date"])
        print("Error              : "+str(e))
        return {"error": "internal server error", "error_message":str(e), "start_date":args["start_date"],"end_date":args["end_date"]}, 1
    
def week():
    # get arguments
    args = request.args
    # get start date
    if "date" in args:
        start_date = args["date"]
    else:
        start_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    start_date = start_date.split("-")

    rmonth = False
    if "rmonth" in args:
        rmonth = True

    try:
        start_date = datetime.datetime( int(start_date[0]), int(start_date[1]), int(start_date[2]) )
        end_date = datetime.timedelta(days=6)
        end_date = start_date + end_date
        return generator.generateWeatherInTimeRange(start_date, end_date, rmonth), 200
    except Exception as e:
        # return error
        print("Inputted start date: "+args["start_date"])
        print("Error              : "+str(e))
        return {"error": "internal server error", "error_message":str(e), "start_date":args["start_date"],"end_date":args["end_date"]}, 2

def month():
    # get arguments
    args = request.args
    # get start date
    if "date" in args:
        start_date = args["date"]
    else:
        start_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    start_date = start_date.split("-")

    rmonth = False
    if "rmonth" in args:
        rmonth = True

    try:
        start_date = datetime.datetime( int(start_date[0]), int(start_date[1]), int(start_date[2]) )
        end_date = datetime.timedelta(days=29)
        end_date = start_date + end_date
        return generator.generateWeatherInTimeRange(start_date, end_date, month), 200
    except Exception as e:
        # return error
        print("Inputted start date: "+args["start_date"])
        print("Error              : "+str(e))
        return {"error": "internal server error", "error_message":str(e), "start_date":args["start_date"],"end_date":args["end_date"]}, 2