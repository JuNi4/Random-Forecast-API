import datetime,random, perlin_noise, numpy as np

def sigmoid(x,width,start,end, t):
    # Generate sigmoid
    sigmaD = t / (t + np.exp(-(1 - x) / width))
    x =  start + (end - start)*(1 - sigmaD)
    # return value
    return x


class fake_weather:

    def __init__(self):
        self.y = 0
        self.m = 0
        self.d = 0
        self.h = 0
        self._setSeeds()

    def _setSeeds(self):
        self.MSA = self.y + self.m + 0
        
        self.DSA = self.y + self.m + self.d + 0
        self.DSB = self.y + self.m + self.d + 1
        self.DSC = self.y + self.m + self.d + 2
        self.DSD = self.y + self.m + self.d + 3
        self.DSE = self.y + self.m + self.d + 3

        self.HSA = self.y + self.m + self.d + self.h + 25 + 0
        self.HSB = self.y + self.m + self.d + self.h + 25 + 1
        self.HSC = self.y + self.m + self.d + self.h + 25 + 2
        self.HSD = self.y + self.m + self.d + self.h + 25 + 3
        self.HSE = self.y + self.m + self.d + self.h + 25 + 4

    def updateData(self):
        # get current date
        today = datetime.date.today()

        # get all date things
        self.y = today.year
        self.m = today.month
        self.d = today.day

        self.h = int(datetime.datetime.now().strftime("%H"))

        self._setSeeds()

    def setData(self, date:str, hour:int):
        date = date.split("-")
        self.y = int(date[0])
        self.m = int(date[1])
        self.d = int(date[2])

        self.h = hour

        self._setSeeds()

    # Get a random weather
    def weather(self, month:int=12):
        ## create final json object
        data = {}

        ## generate random temp ##
        # VAlUES
        profile_min = [-15, -10, -5,  0,  5,  10, 15, 10, 5,  0,  -5, -10, -20]
        profile_max = [ 5,   10,  15, 20, 25, 35, 40, 35, 25, 15, 10,  5,   42]

        TEMP_MIN = profile_min[month] + 273#.15 # Minimum of degrees possible in Kelvin
        TEMP_MAX = profile_max[month] + 273#.15	# Maximum of degrees possible in Kelvin
        # generate lowest and highest temp
        # get distance between MIN and MAX
        distance = TEMP_MAX - TEMP_MIN
        # lowest
        random.seed(self.DSA)
        low = random.randint(TEMP_MIN, int( TEMP_MAX - distance / 2 ))
        # highest
        random.seed(self.DSB)
        high = random.randint(low+5, TEMP_MAX)

        # generate highest time
        random.seed(self.DSA)
        high_time = random.randint(11,14)

        # check wich end gets raised
        random.seed(self.DSB)
        raise_e = random.randint(0,1)

        # generate offset amount
        random.seed(self.DSC)
        offset = random.randint(0,3)

        a = [low, low]
        # make temp connect to the one from the last day
        if self.h < high_time:
            hb = self.h
            db = self.d
            mb = self.m
            yb = self.y
            self.h = 23
            # get yesterdays date
            yesterday = datetime.date(self.y, self.m, self.d) - datetime.timedelta(days=1)
            self.d = yesterday.day
            self.m = yesterday.month
            self.y = yesterday.year
            self._setSeeds()
            # get last temp of yesterday
            a[0] = self.weather(month)["temperature"]["current"]
            self.h = hb
            self.d = db
            self.m = mb
            self.y = yb
            self._setSeeds()
        # offset a random end
        a[raise_e] += offset

        # genrate temperature
        if self.h < high_time:
            # calculate width
            w = high_time / 8
            # calculate x
            x = self.h - w*3
            # calculate temp# calculate temp
            temp = sigmoid(x, w, a[0], high, w)
        elif self.h == high_time:
            temp = high
        elif self.h > high_time:
            # calculate width
            w = (24-high_time) / 8
            # calculate x
            x = self.h-high_time -w*3
            # calculate temp
            temp = sigmoid(x, w, high, a[1], w/2)
        else:
            # if something failes, set temp below absoloute zero
            temp = -1

        data["temperature"] = {"lowest": low, "highest": high, "current": temp}

        # generate raining percentage
        RP_MIN = 0
        RP_MAX = [20,60,50,15]

        if temp < 5 +273.15:
            RP_INDEX = 0
        elif 17 +273.15 > temp > 5 +273.15:
            RP_INDEX = 1
        elif 30 +273.15 > temp > 17 +273.15:
            RP_INDEX = 2
        else:
            RP_INDEX = 3
   
        # get two values determining the start position
        random.seed(self.DSB)
        a = random.randrange(0,100)/100
        random.seed(self.DSA)
        b = random.randrange(0,100)/100
        # random noise
        noise = perlin_noise.PerlinNoise()
        n = noise([self.h / 24, a, b])
        # make n go between high and low
        n += 1
        n /= 2
        rain_percent = (n * (RP_MAX[RP_INDEX] - RP_MIN +1) + RP_MIN) *0.5

        data["rain_percentage"] = rain_percent

        # generate wind
        random.seed(self.HSA)
        
        W_MAX = 50 # KM/H
        W_MIN = 0 # KM/H

        wind_speed = random.randint(W_MIN*100, W_MAX*100)/100

        data["wind_speed"] = wind_speed

        ## generate weather ##
        WEATHER_TYPES = ["Sunshine", "Cloudy", "Partly Cloudy", "Overcast", "Raining", "Snowing", "Foggy", "Windy", "Lightning"]
        # sunny weathers
        SUNNY_WEATHERS = ["Sunshine"]
        # list of cloudy weathers
        CLOUDY_WEATHERS = ["Cloudy","Partly Cloudy","Overcast"]
        # rain weathers
        RAIN_WEATHERS = ["Raining","Snowing","Lightning"]
        
        weather = ""

        # Generate random weather
        random.seed(self.HSB)
        # generate rain
        rain = random.randint(0,100)
        # seed for next random operation
        random.seed(self.HSC)
        # if it will rain
        if rain <= rain_percent:
            # if supposed to be raining, choose rain weather
            random.seed(self.HSD)
            weather = RAIN_WEATHERS[random.randrange(0,len(RAIN_WEATHERS))]
            
        # if no rain will fall
        else:
            cloud_percent = rain_percent * 0.5
            # if not raining, test for clouds
            if rain_percent > 50 and 0:
                cloud_percent = 50

            # generate cloud
            clouds = random.randint(0,100)
            # seed for next random operation
            random.seed(self.HSD)
            # if signs point to cloudy
            if clouds <= cloud_percent:
                # generate type of cloudy
                random.seed(self.HSD)

                weather = CLOUDY_WEATHERS[ random.randrange(0,len(CLOUDY_WEATHERS)) ]
            # otherwise generate random weather
            else:
                weather = WEATHER_TYPES[random.randrange(0, len(WEATHER_TYPES))]		

        # if it is colder than freezing and raining/lighting
        if weather in ["Raining","Lightning"] and temp < 273.15:
            # set weather to snow
            weather = "Snowing"
        # else if it is warmer than freezing and snowing
        elif weather == "Snowing" and temp > 273.15:
            # set weather to rain
            weather = "Raining"

        # add weather to data
        data["weather"] = weather

        return data