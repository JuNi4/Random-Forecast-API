import datetime,random, numpy as np

def sigmoid(x,width,start,end, t):
    # Generate sigmoid
    sigmaD = t / (t + np.exp(-(1 - x) / width))
    x =  start + (end - start)*(1 - sigmaD)
    # return value
    return x

class fake_weather:

    # init function setting dates and stuff
    def __init__(self):
        self.y = 0
        self.m = 0
        self.d = 0
        self.h = 0
        self._setSeeds()

    # set the target time to now
    def updateData(self):
        # get current date
        today = datetime.date.today()

        # get all date things
        self.y = today.year
        self.m = today.month
        self.d = today.day

        self.h = int(datetime.datetime.now().strftime("%H"))

        self._setSeeds()

    # enter a custom time
    def setData(self, date:str, hour:int):
        date = date.split("-")
        self.y = int(date[0])
        self.m = int(date[1])
        self.d = int(date[2])

        self.h = hour

        self._setSeeds()
    
    # seed start values for dynamic seeds
    def _setSeeds(self):
        # monthly changing seeds
        self.MS_GENERATED = 0
        self.MS = self.y + self.m * 5618
        
        # dayly changing seeds
        self.DS_GENERATED = 0
        self.DS = self.y + self.m + self.d * 245168

        # hourly changing seeds
        self.HS_GENERATED = 0
        self.HS = self.y + self.m + self.d + self.h * 4541

    # function for generating a random hourly changing seed seed
    def _hs(self):
        seed = self.HS + self.HS_GENERATED
        self.HS_GENERATED += 1

        random.seed(seed)

        return seed

    # function for generating a random dayly changing seed seed
    def _ds(self):
        seed = self.DS + self.DS_GENERATED
        self.DS_GENERATED += 1

        random.seed(seed)

        return seed
    
    # function for generating a random monthly changing seed seed
    def _ms(self):
        seed = self.MS + self.MS_GENERATED
        self.MS_GENERATED += 1

        random.seed(seed)

        return seed
    
    # rain function
    def fake_rain(self, temp):
        ## generate rain percentage
        # rain percentage min and max vars
        RP_MIN = 0
        # Rain Profiles
        #          >5°  5°-17° 17°-30° <30°
        RP_MAX = [  25, 90,    40,      15]

        # select a maximum percentage based on temp
        if temp < 5 +273.15: # below 5°C
            RP_MAX = RP_MAX[0]
        elif 17 +273.15 > temp > 5 +273.15: # between 17°C and 5°C
            RP_MAX = RP_MAX[1]
        elif 30 +273.15 > temp > 17 +273.15: # between 30°C and  17°C
            RP_MAX = RP_MAX[2]
        else: # above 30°C
            RP_MAX = RP_MAX[3]
        
        # generate the value for the entire day
        self._ds()
        RP = random.randint(RP_MIN,RP_MAX) / 100

        ## generate how many times it will be raining
        # generate a random number from 0 - 1000
        self._ds()
        start_number = random.randint(0,1000) / RP

        # how many times it will rain
        number_rain = 0

        while start_number >= 1: number_rain += 1; start_number /= RP
        

if __name__ == "__main__":
    weather = fake_weather()

    print( weather.fake_rain(0) )