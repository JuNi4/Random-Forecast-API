from fake_info import fake_weather, fake_date
import datetime

# generates all weathers from a starting date to a finish date
def generateWeatherInTimeRange(start_date = datetime.datetime(2023, 5, 20), end_date = datetime.datetime(2023, 5, 21), rmonth = False):
    # fake weather generator
    x = fake_weather.fake_weather()
    # return var
    out = []

    # calulate days between 
    delta = end_date - start_date
    DAYS = delta.days

    # generate weather for all days
    for day in range(0, DAYS+1):
        # get date i days different from current
        d = datetime.timedelta(days=day)
        I_DATE = start_date + d
        # a list of all weather data across the day
        weather_data = []
        # generate all weathers for the day
        for hour in range(0,24):
            # set data
            date = I_DATE.strftime("%Y-%m-%d")
            x.setData( date,hour )
            # generate day of the week
            day = fake_date.date(x.DSD)
            month = fake_date.month(x.MSA)
            if not rmonth:
                monthi = fake_date.monthi(x.MSA)
            else:
                monthi = I_DATE.month - 1
            # generate weather
            weather = x.weather(monthi)
            # create final json construct
            data = {
                "at": {
                    "date": date,
                    "hour": hour,
                    "day": day,
                    "month": month
                },
                "weather": weather
            }

            # add data to list
            weather_data.append(data)

        # add day to return var
        out.append(weather_data)

    return out

def generateWeatherOneDay(date = datetime.datetime.now(), rmonth = False):
    # fake weather generator
    x = fake_weather.fake_weather()
    # return var
    out = []

    if not rmonth:
        monthi = fake_date.monthi(x.MSA)
    else:
        monthi = date.month - 1
    
    # generate general things for the day
    date = date.strftime("%Y-%m-%d")
    # generate weather
    x.setData( date,0 )
    # generate day of the week
    day = fake_date.date(x.DSD)
    month = fake_date.month(x.MSA)

    # generate all weathers for the day
    for hour in range(0,24):
        # generate weather
        x.setData( date,hour )

        weather = x.weather(monthi)
        # create final json construct
        data = {
            "at": {
                "date": date,
                "hour": hour,
                "day": day,
                "month": month
            },
            "weather": weather
        }

        # add data to list
        out.append(data)

    return out

def generateWeatherOneHour(date = datetime.datetime.now(), hour = 0, rmonth=False):
    # fake weather generator
    x = fake_weather.fake_weather()
    # return var
    out = []

    if not rmonth:
        monthi = fake_date.monthi(x.MSA)
    else:
        monthi = d.month - 1

    # generate general things for the day
    date = date.strftime("%Y-%m-%d")
    # generate weather
    x.setData( date,hour )

    # generate day of the week
    day = fake_date.date(x.DSD)
    month = fake_date.month(x.MSA)

    # generate weather
    weather = x.weather(monthi)
    # create final json construct
    data = {
        "at": {
            "date": date,
            "hour": hour,
            "day": day,
            "month": month
        },
        "weather": weather
    }

    return data