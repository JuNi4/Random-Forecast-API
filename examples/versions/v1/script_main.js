// Setup demo values
// Fahrenheit -> Celsius    (90 °F − 32 ) × 5/9
// Celsius    -> Fahrenheit (32 °C × 9/5) + 32
//document.getElementById("date_text").innerHTML = "Monday 1/1/2000";
//document.getElementById("weather_text").innerHTML = "Cloudy, 90°F - 90% Rain";

// Params
const param = new URLSearchParams(window.location.search);
console.log(param.toString());
//param.get('x')
//param.has('x')

// set initial unit mode
var mode = "rest";

if (param.has('us')) {
    mode = "us";
    setMode("us");
}

function K2F(inp) {
    return (inp - 273.15) * 9/5 + 32;
}

function K2C(inp) {
    return inp - 273.15;
}

function setMode(mode) {
    if (mode == "us") {
        document.getElementById("us").classList.add("selected_button");
        document.getElementById("us").classList.remove("button");
        document.getElementById("rest").classList.add("button");
        document.getElementById("rest").classList.remove("selected_button");

        window.history.replaceState("Random Forecast (US)","Random Forecast (US)","https://random-forecast.juni7.repl.co/?us");
    } else if (mode == "rest") {
        document.getElementById("rest").classList.add("selected_button");
        document.getElementById("rest").classList.remove("button");
        document.getElementById("us").classList.add("button");
        document.getElementById("us").classList.remove("selected_button");

        window.history.replaceState("Random Forecast","Random Forecast","https://random-forecast.juni7.repl.co/");
    }
    
    return (mode);
}

data_now = {}
data_today = []

main_loop = 100

call_pause = 0
call_pause_length = 10*60 * (1000/main_loop)

api_url = "https://random-forecast-api.juni7.repl.co"

async function getWeatherData() {
    // check if call is paused
    if (call_pause > 0) {
        call_pause -= 1;
        return;
    } else { call_pause = call_pause_length; }
    // get weather data for the current hour and day
    try {
        const response = await fetch(api_url+"/forecast/now");
        const jsonData = await response.json();
        data_now = await jsonData
    } catch {
        call_pause = 0;
    }
    // get the weather data for the whole day
    try {
        const response = await fetch(api_url+"/forecast/today");
        const jsonData = await response.json();
        data_today = await jsonData
    } catch {
        call_pause = 0;
    }
}


// a list of all days
var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
var weathers = ["Sunshine", "Cloudy", "Partly Cloudy", "Overcast", "Raining", "Snowing", "Foggy", "Lightning", "Windy"]

// main thing
function main() {
    // get current time and date //
    var d = new Date();
    var date = ""
    // create date
    date = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
    // add time
    date += " "+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    
    // get weather data
    getWeatherData()
    try { // make the "at" not found in data_now errors go away
    date = data_now["at"]["day"] + " " + date
    // update date and time
    document.getElementById("date_text").innerHTML = date;
    
    // get current weather //
    var weather = data_now["weather"]["weather"]

    var temp = data_now["weather"]["temperature"]["current"]
    // if nessesary, convert temp
    if (mode == "us") {
        temp = Math.round( K2F( temp ) ) + "°F"
    } else {
        temp = Math.round( K2C( temp ) ) + "°C"
    }

    weather += ", " + temp
    
    // update weather
    document.getElementById("weather_text").innerHTML = weather;
    } catch {}
}

// make function run
var t=setInterval(main,main_loop);