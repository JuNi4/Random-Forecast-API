// Setup demo values
// Fahrenheit -> Celsius    (90 °F − 32 ) × 5/9
// Celsius    -> Fahrenheit (32 °C × 9/5) + 32
//document.getElementById("date_text").innerHTML = "Monday 1/1/2000";
//document.getElementById("weather_text").innerHTML = "Cloudy, 90°F - 90% Rain";

// Params
const param = new URLSearchParams(window.location.search);

// Settings //
data_now = {"at":{"date":"0-0-0","day":"None","hour":0},"weather":{"temperature":{"current":0,"highest":0,"lowest":0},"weather":"None"}}
data_today = []
// add blank data to data_today
for (i = 0; i < 25; i++) {
    data_today.push(data_now)
}

main_loop = 50

call_pause = 0
call_pause_length = 10*60 * (1000/main_loop)

api_url = "https://random-forecast-api.juni7.repl.co"
own_url = "https://random-forecast.juni7.repl.co/"
img_url = "https://random-forecast.juni7.repl.co/icons/"

// log settings
console.log("### Settings ###")
console.log("Main loop every "+main_loop+" ms.")
console.log("Calling api every "+(call_pause_length/(1000/main_loop))+"s.")
console.log("API URL: "+api_url)
console.log("Own URL: "+own_url)
console.log("################")

// set initial unit mode
var mode = "rest";
// set unit mode based on parameters
if (param.has('us')) {
    mode = "us";
    setMode("us");
} else if (param.has('scientific')) {
    mode = setMode("science");
}

// converts kelvin to fahrenheit
function K2F(inp) {
    return (inp - 273.15) * 9/5 + 32;
}

// converts kelvin to celsius
function K2C(inp) {
    return inp - 273.15;
}

// removes to classes and adds one
function setClass(id, classs) {
    document.getElementById(id).classList.remove("selected_button", "button");
    document.getElementById(id).classList.add(classs);
}

// sets the unit mode
function setMode(mode) {
    if (mode == "us") {
        setClass("us","selected_button");
        setClass("rest","button");
        setClass("science","button");

        window.history.replaceState("Random Forecast (US)","Random Forecast (US)",own_url+"?us");
    } else if (mode == "rest") {
        setClass("us","button");
        setClass("rest","selected_button");
        setClass("science","button");

        window.history.replaceState("Random Forecast","Random Forecast",own_url);
    } else if (mode == "science") {
        setClass("us","button");
        setClass("rest","button");
        setClass("science","selected_button");

        window.history.replaceState("Random Forecast (Scientific)","Random Forecast (Scientific)",own_url+"?scientific");
    }
    
    return (mode);
}

async function getWeatherData() {
    // check if call is paused
    if (call_pause > 0) {
        call_pause -= 1;
        return;
    } else { call_pause = call_pause_length; }
    // get weather data for the current hour and day
    try {
        var d = new Date();
        date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()
        const response = await fetch(api_url+"/forecast/day?date="+date);
        const jsonData = await response.json();
        data_now = await jsonData[d.getHours()]
        data_today = await jsonData
    } catch {
        call_pause = 0;
    }
}

function convertTemp(temp) {
    if (mode == "us") {
        temp = Math.round( K2F( temp ) ) + "°F"
    } else if (mode == "rest") {
        temp = Math.round( K2C( temp ) ) + "°C"
    } else if (mode == "science") {
        temp = Math.round(temp) + " K"
    }

    return temp
}

// for scaling an object
var bgHeight = document.getElementById('background').offsetHeight;

// a list of all days
var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
var weathers = ["Sunshine", "Cloudy", "Partly Cloudy", "Overcast", "Raining", "Snowing", "Foggy", "Lightning", "Windy"]

// main thing
function main() {
    // update div hight
    var offsetHeight = document.getElementById('weather_cards').offsetHeight;
    document.getElementById("background").style.height = (bgHeight + offsetHeight) + "px";

    // get current time and date //
    var d = new Date();
    var date = ""
    // create date
    date = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
    // add time
    date += " "+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    
    // get weather data
    getWeatherData()
    //try { // make the "at" not found in data_now errors go away
    // get current day of the week
    date = data_now["at"]["day"] + " " + date
    // update date and time
    document.getElementById("date_text").innerHTML = date;
    
    // get current weather //
    var weather = data_now["weather"]["weather"]
    var temp = data_now["weather"]["temperature"]["current"]

    var temp_high = data_now["weather"]["temperature"]["highest"]
    var temp_low = data_now["weather"]["temperature"]["lowest"]
    //⏶ ... - ... ⏷ ￪￬ ▲▼ ▴▾
    var temp_extreme_str = "▴ "+convertTemp(temp_high)+"  "+convertTemp(temp_low)+" ▾"
    // get rain percent
    var rain_percent = Math.round(data_now["weather"]["rain_percentage"])
    // convert temp
    temp = convertTemp(temp)

    weather += ", " + temp + " - " + rain_percent + "% Rain"
    
    // update weather
    document.getElementById("weather_text").innerHTML = weather;
    document.getElementById("temperature_extremes").innerHTML = temp_extreme_str;


    // get weather card data
    var hour = d.getHours()
    // if the hour is less than 3, set starting hour to 0
    if ( hour < 3 ) {
        hour = 0
    // if there are less than 3 hours remaining, set the starting hour 7 hours less than 24
    } else if ( hour > 21 ) {
        hour = 17
    // change the starting hour by -3 to have the first card be 3 hours ago
    } else {
        hour -= 3
    }

    // variables for weather cards
    var hours  = []
    var temps  = []
    var images = []
    var weathers = []
    // get all values
    for ( i = hour; i < hour + 7; i++) {
        // add hour string to hours list
        hours.push(i+":00")
        // add temperature
        temps.push(convertTemp(data_today[i]["weather"]["temperature"]["current"]))
        // add weather type
        var weather = data_today[i]["weather"]["weather"]
        if (weather == "Snowing") {
            images.push(img_url+"snowing.png")
        } else if (weather == "Lightning") {
            images.push(img_url+"lightning.png")
        } else if (weather == "Raining") {
            images.push(img_url+"rain.png")
        } else if (weather == "Foggy") {
            images.push(img_url+"foggy.png")
        } else if (weather == "Windy") {
            images.push(img_url+"windy.png")
        } else if (["Cloudy","Overcast"].includes(weather)) {
            images.push(img_url+"cloudy.png")
        } else if (weather == "Partly Cloudy") {
            images.push(img_url+"partly_cloudy.png")
        } else if (weather == "Sunshine") {
            images.push(img_url+"sun.png")
        } else {
            console.warn("Can not identify weather "+weather)
            // tempoary debug!/
            images.push(img_url+"question_mark.png")
        }
        weathers.push(data_today[i]["weather"]["weather"]);
    }

    // update all weather cards
    for (i = 0; i < 7; i++) {
        document.getElementById("h"+i).innerHTML = hours[i] + "<br>" + temps[i] + "<br>"
        document.getElementById("hi"+i).title = weathers[i]
        document.getElementById("hi"+i).src = images[i]
    }

    //} catch {}
}

// make function run
var t=setInterval(main,main_loop);