import datetime
import random

months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] # "Tutherday"

# get a random day
def date(seed = ""):
	if seed == "":
		today = datetime.date.today()
		random.seed(today.day+today.month+today.year)
	else:
		random.seed(seed)

	return days[random.randrange(0,len(days))]


def month(seed=""):
    if seed == "":
        today = datetime.date.today()
        random.seed(today.month+today.year)
    else:
        random.seed(seed)

    return months[random.randrange(0,len(months))]

def monthi(seed=""):
    if seed == "":
        today = datetime.date.today()
        random.seed(today.month+today.year)
    else:
        random.seed(seed)

    return random.randrange(0,len(months))