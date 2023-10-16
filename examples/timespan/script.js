// Setup demo values
// Fahrenheit -> Celsius    (90 °F − 32 ) × 5/9
// Celsius    -> Fahrenheit (32 °C × 9/5) + 32
//document.getElementById("date_text").innerHTML = "Monday 1/1/2000";
//document.getElementById("weather_text").innerHTML = "Cloudy, 90°F - 90% Rain";

// setup date input fields
// set start date
document.getElementById('start_date').valueAsDate = new Date();
// set end date
var d = new Date();
d.setDate(d.getDate() + 7)
document.getElementById('end_date').valueAsDate = d

// Params
const param = new URLSearchParams(window.location.search);

// Cookie functions
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=None;Secure" + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Settings //
data_now = {"at":{"date":"0-0-0","day":"None","hour":0},"weather":{"temperature":{"current":0,"highest":0,"lowest":0},"weather":"None","wind_speed":0}}
data_day = []
data_week = []
// add blank data to data_week
for (i = 0; i < 25; i++) {
    data_day.push(data_now)
}
for (i = 0; i < 25; i++) {
    data_week.push(data_day)
}


// Get if a date is set
if ( param.has("start_date") ) {
    document.getElementById('start_date').value = param.get("start_date")
}
if ( param.has("end_date") ) {
    document.getElementById('end_date').value = param.get("end_date")
}

// amount of milliseconds between main call
var MAIN_LOOP = 50

// api calls
var CALL_PAUSE = 0
var CALL_PAUSE_LENGTH = 10*60 * (1000/MAIN_LOOP)

// urls
var API_URL = "http://localhost/api/"                   // the url of the api
var OWN_URL = location.protocol + '//' + location.host + location.pathname  // The own url
var IMAGE_ROOT = "../icons"                                                 // Root of the icons folder

// cookie settings
COOKIE_EXPIRE = 30 // in days
MODE_COOKIE = "uom_mode"

// weather cards
var PLAIN_CARD = '<div id="UCID" class="weather_card"> <div id="UID">...<br>..<br>..</div> <img src="../../icons/question_mark.png" id="UIID" title="..."></div>'
var ROW_DIV = '<div class="weather_card_row">CONTENT</div>'

var NUM_CARDS = 30
var CURRENT_CARD = 0

if ( param.has("cards") ) {
    NUM_CARDS = (param.get("cards"))*1
    CURRENT_CARD = Math.floor(NUM_CARDS/2)
}

// weather types
var WEATHER_TYPES = {}

fetch("https://random-forecast.juni7.repl.co/icons/icons.json")
    .then((res) => res.json())
    .then((text) => {
        // load weather types as json
        WEATHER_TYPES = text
    })
    .catch((e) => console.error(e));

// log settings
console.log("### Settings ###")
console.log("Main loop every "+MAIN_LOOP+" ms.")
console.log("Calling api every "+(CALL_PAUSE_LENGTH/(1000/MAIN_LOOP))+"s.")
console.log("API URL: "+API_URL)
console.log("Own URL: "+OWN_URL)
console.log("################")

// get width of demo weather card
var CARD_WIDTH = document.getElementById('remove-me').offsetWidth + 20;

// previus width to keep track of when it updates
var previus_width = 0

// setup cards
function weatherCardsSetup(bg_width) {
    // get background object width
    //var bg_width = document.getElementById('background').offsetWidth;
    bg_width -= 200 // remove ten pixels as padding
    // get how many cards per row
    cpr = Math.ceil( bg_width / CARD_WIDTH )
    // figure out how many rows are needed
    num_rows = Math.ceil( NUM_CARDS / cpr )

    tmp_row = ""
    // add rows
    for ( row = 0; row < num_rows; row++ ) {
        // cards processed for knowing when to stop
        cards_processed = row*cpr
        // string for holding all the card objects
        card_holder = ""
        // add all cards
        for (card = 0; card < cpr && cards_processed + card < NUM_CARDS; card++) {
            // get card id
            card_id = cards_processed + card
            // create card
            var tmp_card = PLAIN_CARD;
            // replace things with ids n' such
            tmp_card = tmp_card.replace("UID","h" + card_id)
            tmp_card = tmp_card.replace("UCID","hc" + card_id)
            tmp_card = tmp_card.replace("UIID","hi" + card_id)
            // ad card to row
            card_holder += "\n\t"+tmp_card
        }
        // add rows
        tmp_row += ROW_DIV.replace("CONTENT",card_holder+"\n")+"\n"
    }
    // add all elements to screen
    document.getElementById('weather_cards').innerHTML = tmp_row
}

// set initial unit mode
var mode = "rest";
// set unit mode based on parameters
if (param.has('us')) {
    mode = "us";
    setMode("us");
} else if (param.has('scientific')) {
    mode = setMode("science");
}

// get unit mode cookie
x=getCookie(MODE_COOKIE);if(x!=""){mode=setMode(x);}

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

function setURL(url, title) {
    url = url.replace('=&', '')
    if ( url.substring(url.length-1,url.length) == "=" ) { url = url.substring(0,url.length-1) }
    window.history.replaceState(title,title,url);
}

// sets the unit mode
function setMode(mode) {
    if (mode == "us") {
        // set the classes of the button
        setClass("us","selected_button");
        setClass("rest","button");
        setClass("science","button");

        // delete and add nessecary params
        param.delete("scientific")
        param.set("us","")
        // convert search params to string
        ps = param.toString()
        if (ps != "") { ps = "?" + ps }
        // update url
        setURL(OWN_URL + ps, "(WIP) Random Forecast (US)")
    } else if (mode == "rest") {
        // set the classes of the button
        setClass("us","button");
        setClass("rest","selected_button");
        setClass("science","button");

        // delete and add nessecary params
        param.delete("scientific")
        param.delete("us")
        // convert search params to string
        ps = param.toString()
        if (ps != "") { ps = "?" + ps }
        // update url
        setURL(OWN_URL + ps, "(WIP) Random Forecast")
    } else if (mode == "science") {
        // set the classes of the button
        setClass("us","button");
        setClass("rest","button");
        setClass("science","selected_button");

        // delete and add nessecary params
        param.delete("us")
        param.set("scientific","")
        // convert search params to string
        ps = param.toString()
        if (ps != "") { ps = "?" + ps }
        // update url
        setURL(OWN_URL + ps, "(WIP) Random Forecast (SCIENTIFIC)")
    }
    // set mode cookie
    setCookie(MODE_COOKIE, mode, COOKIE_EXPIRE)
    // return mode
    return (mode);
}

async function getWeatherData() {
    // check if call is paused
    if (CALL_PAUSE > 0) {
        CALL_PAUSE -= 1;
        return;
    } else { CALL_PAUSE = CALL_PAUSE_LENGTH; }
    // log api call
    console.log("Calling API")
    // get weather data for the current hour and day
    try {
        var d = new Date();

        START_DATE = document.getElementById('start_date').value
        END_DATE = document.getElementById('end_date').value
        
        const response = await fetch(API_URL+"/forecast/range?rmonth&start_date="+START_DATE+"&end_date="+END_DATE);
        const jsonData = await response.json();
        data_now = await jsonData[0][d.getHours()]
        data_week = await jsonData
    } catch(e) {
        console.warn("An error accured while fetching data from API: "+e)
        CALL_PAUSE = 0;
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

function convertSpeed(speed) {
    if (mode=="us") {
        return (speed / 1.609).toFixed(2) + " mph"
    } else {
        return (speed.toFixed(2)) + " km/h"
    }
}

// for scaling an object
var bgHeight = document.getElementById('background').offsetHeight;

// a list of all days
var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
var weathers = ["Sunshine", "Cloudy", "Partly Cloudy", "Overcast", "Raining", "Snowing", "Foggy", "Lightning", "Windy"]

var old_d1 = new Date().getTime()
var old_d1 = new Date().getTime()
var diff = true

// main thing
function main() {
    // get difference in days
    date1 = document.getElementById('start_date').valueAsDate
    date2 = document.getElementById('end_date').valueAsDate
    
    if (old_d1 != date1.getTime() || old_d2 != date2.getTime()) {
        diff = true
        old_d1 = date1.getTime()
        old_d2 = date2.getTime()
        CALL_PAUSE = 0
    }
    
    // To calculate the time difference of two dates
    var time_diff = date2.getTime() - date1.getTime()
    // To calculate the no. of days between two dates
    var difference = time_diff / (1000 * 3600 * 24);
    
    // check if width has changed
    var w = document.getElementById('weather_cards').offsetWidth;
    if (w != previus_width || diff) {
        // update card amount
        NUM_CARDS = difference
        // clamp cards between 0 and infinity
        if ( NUM_CARDS <= 0 ) {
            // set num cards to one
            NUM_CARDS = 1
            // change end date to one day in the future
            var d = new Date();
            d.setDate(d.getDate() + 1)
            document.getElementById('end_date').valueAsDate = d
        }
        // update date
        DATE = document.getElementById('start_date').value
        // update cards
        weatherCardsSetup(w)
        previus_width = w
    }
    // update div hight
    //var offsetHeight = document.getElementById('weather_cards').offsetHeight;
    //document.getElementById("background").style.height = (bgHeight + offsetHeight) + "px";

    // get current time and date //
    var d = new Date();
    var date = ""
    // create date
    if (DATE == "") {
        date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()
    } else {
        date = DATE
    }

    // add time
    date += " "+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    
    // check if hour has changed
    if (d.getHours() != data_now["at"]["hour"] && CALL_PAUSE > 1 * (1000/MAIN_LOOP)) { CALL_PAUSE = 1 * (1000/MAIN_LOOP); }
    // get weather data
    getWeatherData()
    //try { // make the "at" not found in data_now errors go away
    // get current day of the week
    //date = data_now["at"]["day"] + ", " + data_now["at"]["month"] + ", " + date
    date = data_now["at"]["day"] + " " + date
    // update date and time
    document.getElementById("date_text").innerHTML = date;
    
    // get current weather //
    var weather = data_now["weather"]["weather"]
    var temp = data_now["weather"]["temperature"]["current"]

    var temp_high = data_now["weather"]["temperature"]["highest"]
    var temp_low = data_now["weather"]["temperature"]["lowest"]

    // get wind speed
    var wind_speed = convertSpeed(data_now["weather"]["wind_speed"])
    //⏶ ... - ... ⏷ ￪￬ ▲▼ ▴▾
    var temp_extreme_str = "▴ "+convertTemp(temp_high)+"  "+convertTemp(temp_low)+" ▾  " + wind_speed
    // get rain percent
    var rain_percent = Math.round(data_now["weather"]["rain_percentage"])
    // convert temp
    temp = convertTemp(temp)

    weather += ", " + temp + " - " + rain_percent + "% Rain"
    
    // update weather
    document.getElementById("weather_text").innerHTML = weather;
    document.getElementById("temperature_extremes").innerHTML = temp_extreme_str;

    // variables for weather cards
    var dates = []
    var dotw = []
    var temp_lows = []
    var temp_highs = []
    var wind_speeds = []
    var weathers = []
    var images = []
    // get all valuesu
    for ( i = 0; i < NUM_CARDS; i++) {
        // check if date surpasses data
        if ( i < 0 || i > data_week.length ) {
            //images.push(IMAGE_ROOT + "question_mark.png")
            dates.push("None")
            dotw.push("None")
            temp_lows.push("None")
            temp_highs.push("None")
            wind_speed.push("None")
            weathers.push("None")
            images.push("")
            continue;
        }
        // add hour string to hours list
        dates.push(data_week[i][0]["at"]["date"])
        // add temperature
        temp_lows.push(convertTemp(data_week[i][0]["weather"]["temperature"]["lowest"]))
        temp_highs.push(convertTemp(data_week[i][0]["weather"]["temperature"]["highest"]))

        //weathers.push(data_today[i]["weather"]["weather"]);
        // averages //
        
        // weather setup
        weather_counts = {"Sunshine":0, "Cloudy":0, "Partly Cloudy":0, "Overcast":0, "Raining":0, "Snowing":0, "Foggy":0, "Windy":0, "Lightning":0}
        // wind speed setup
        wind_speed = 0

        // quicker access
        var data_day = data_week[i]

        // add day of the week
        dotw.push(data_day[0]["at"]["day"])
        
        // loop over all hours
        for (h = 0; h < data_week[i].length; h++) {
            // add wind speed
            wind_speed += data_day[h]["weather"]["wind_speed"]
            // add weather
            try {
                weather = data_day[h]["weather"]["weather"]
            } catch {
                weather = null
            }
            // only add if weather_counts has weather
            if ( weather_counts[weather] != null ) {
                weather_counts[weather] ++;
            }
        }
        // make averages
        wind_speed /= data_day.length
        wind_speeds.push(convertSpeed(wind_speed))

        // pick most common weather
        common = ""
        points = 0

        for (const [key, value] of Object.entries(weather_counts)) {
            // if value is higher
            if (value > points) {
                // update values
                points = value
                common = key
            }
        }
        // if nothing was present, set to none
        if ( points = 0 ) { common = "None" }

        // get image from weather name
        if ( WEATHER_TYPES[common] != null ) {
            weathers.push(common)
            images.push(WEATHER_TYPES[common])
        } else {
            weathers.push("None")
            images.push("")
        }
    }

    // update all weather cards
    for (i = 0; i < NUM_CARDS; i++) {
        text = "<b>"+dotw[i]+"</b><br>"+dates[i] + "<br>"
        text += "▴ " + temp_highs[i] + "  " + temp_lows[i] + " ▾"
        document.getElementById("h"+i).innerHTML = text
        document.getElementById("hi"+i).title = weathers[i]
        document.getElementById("hi"+i).src = images[i].replace("$IMAGE_ROOT",IMAGE_ROOT)
        // get current time
        var d = new Date()
        // highlight if card is current hour
        if ( i == 0 ) {
            // highlight element
            document.getElementById("hc"+i).classList.add("weather_card_current");
        } else {
            document.getElementById("hc"+i).classList.remove("weather_card_current");
        }
    }
    //} catch {}
}

// make function run
var t=setInterval(main,MAIN_LOOP);