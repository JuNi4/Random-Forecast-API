// Navigate with unit saved //
// Params
const param = new URLSearchParams(window.location.search);

var OWN_URL2 = location.protocol + '//' + location.host

var places = {
    "day": "/",
    "week": "/timespan/week/",
    "month": "/timespan/month/",
    "timespan": "/timespan/"
}

function nav(place) {
    // navigate to the place
    if (places[place]) {
        //p = ""
        //if (param.toString() != "") { p =  }
        url = OWN_URL2 + places[place] + param.toString()
        url = url.replace('=&', '')
        if ( url.substring(url.length-1,url.length) == "=" ) { url = url.substring(0,url.length-1) }
        window.location.href = url
    }
}

// Cookie attempt //
// cookie settings
COOKIE_EXPIRE = 30 // in days
MODE_COOKIE = "uom_mode"
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

// on startup, read cookie
x=getCookie(MODE_COOKIE);if(x!=""){mode=setMode(x);}