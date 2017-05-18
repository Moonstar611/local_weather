/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//map script below
function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(52, 0),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    var googleMap = new google.maps.Map(document.getElementById("map"), mapOptions);
    var infoWindow = new google.maps.InfoWindow({map: googleMap});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            googleMap.setCenter(pos);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng)
            });
            marker.setMap(googleMap);
        }, function (err) {
            window.alert(err.message);
            handleLocationError(true, googleMap.getCenter(), infoWindow);
        });
    } else {
        handleLocationError(false, googleMap.getCenter(), infoWindow);
    }
}
function handleLocationError(hasGeoLocation, pos, infoWindow) {

    infoWindow.setPosition(pos);
    infoWindow.setContent(hasGeoLocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn\'t support geolocation.");
}
//map script above
function locationStart() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            setLocation(lat, lon);
            lat = Math.round(lat);
            lon = Math.round(lon);
            var apiurl = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=a18867f0a7791241146796a699290470";
            getWeather(apiurl);
        }, function(err){
            window.alert(err.message);
        });
    }
}

//weather script below
var bigC = true;
var degreeC = 0;
var degreeF = 0;
var degree_minC = 0;
var degree_minF = 0;
var degree_maxC = 0;
var degree_maxF = 0;
var ID = 0;
var weathertext = "";


var codeToClass = {
    "c200232": ["wi-day-thunder-storm", "wi-night-thunderstorm"],
    "c300321": ["wi-day-showers", "wi-night-showers"],
    "c500504": ["wi-day-rain", "wi-night-rain"],
    "c511615616": ["wi-day-rain-mix", "wi-night-rain-mix"],
    "c520531": ["wi-showers", "wi-showers"],
    "c600602": ["wi-day-snow", "wi-night-snow"],
    "c611": ["wi-day-sleet", "wi-night-sleet"],
    "c612": ["wi-sleet", "wi-sleet"],
    "c620622": ["wi-snow", "wi-snow"],
    "c701771": ["wi-dust", "wi-dust"],
    "c741": ["wi-day-fog", "wi-night-fog"],
    "c762": ["wi-volcano", "wi-volcano"],
    "c781900": ["wi-tornado", "wi-tornado"],
    "c800951": ["wi-day-sunny", "wi-night-clear"],
    "c801": ["wi-day-cloudy", "wi-night-cloudy"],
    "c802803": ["wi-cloud", "wi-cloud"],
    "c804": ["wi-cloudy", "wi-cloudy"],
    "c901960961": ["wi-storm-warning", "wi-storm-warning"],
    "c902962": ["wi-hurricane", "wi-hurrican"],
    "c903": ["wi-snowflake-cold", "wi-snowflake-cold"],
    "c904": ["wi-hot", "wi-hot"],
    "c905": ["wi-windy", "wi-windy"],
    "c906": ["wi-hail", "wi-hail"],
    "c952956": ["wi-day-light-wind", "wi-night-cloudy-windy"],
    "c957959": ["wi-gale-warning", "wi-gale-warning"]
}
function dayOrNight() {
    var d = new Date();
    var h = d.getHours();
    if (h >= 19 || h <= 6)
        return 1;
    else
        return 0;
}
function setLocation(lat, lon) {
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyBtyEBydnsFZv6bPY4wGFN4ZBQcxdLmFgk", function (json) {
        var city = json["results"][0]["address_components"][2]["long_name"];
        var state = json["results"][0]["address_components"][5]["short_name"];
        $("#city").html(city);
        $("#state").html(state);
    });
}

function getIconClass(id) {
    if (id >= 200 && id <= 232) {
        return "c200232";
    } else if (id >= 300 && id <= 321) {
        return "c300321";
    } else if (id >= 500 && id <= 504) {
        return "c500504";
    } else if (id == 511 || id == 615 || id == 616) {
        return "c511615616";
    } else if (id >= 520 && id <= 531) {
        return "c520531";
    } else if (id >= 600 && id <= 602) {
        return "c600602";
    } else if (id == 611) {
        return "c611";
    } else if (id == 612) {
        return "c612";
    } else if (id >= 620 && id <= 622) {
        return "c620622";
    } else if (id == 741) {
        return "c741";
    } else if (id == 762) {
        return "c762";
    } else if (id >= 701 && id <= 771) {
        return "c701771";
    } else if (id == 781 || id == 900) {
        return "c781900";
    } else if (id == 800 || id == 951) {
        return "c800951";
    } else if (id == 801) {
        return "c801";
    } else if (id == 802 || id == 803) {
        return "c802803";
    } else if (id == 804) {
        return "c804";
    } else if (id == 901 || id == 960 || id == 961) {
        return "c901960961";
    } else if (id == 902 || id == 962) {
        return "c902962";
    } else if (id == 903) {
        return "c903";
    } else if (id == 904) {
        return "c904";
    } else if (id == 905) {
        return "c905";
    } else if (id == 906) {
        return "c906";
    } else if (id >= 952 && id <= 956) {
        return "c952956";
    } else if (id >= 957 && id <= 959) {
        return "c957959";
    }
}
function setIcon(id) {
    var className = getIconClass(id);
    var newClass = codeToClass[className][dayOrNight()];
    $("#weather").addClass(newClass);
}
function calculateF(c) {
    return Math.round(c * 5 / 9 + 32);
}
function switchCF(para) {
    if (para) {
        $("#templg").html(degreeF);
        $("#tempsm").html(degreeC);
        $("#unitlg").removeClass("wi-celsius");
        $("#unitlg").addClass("wi-fahrenheit");
        $("#unitsm").removeClass("wi-fahrenheit");
        $("#unitsm").addClass("wi-celsius");
        $("#hi-temp").html(degree_maxF);
        $("#lo-temp").html(degree_minF);
        $("#unit-r1").removeClass("wi-celsius");
        $("#unit-r2").removeClass("wi-celsius");
        $("#unit-r1").addClass("wi-fahrenheit");
        $("#unit-r2").addClass("wi-fahrenheit");

    } else {
        $("#templg").html(degreeC);
        $("#tempsm").html(degreeF);
        $("#unitlg").removeClass("wi-fahrenheit");
        $("#unitlg").addClass("wi-celsius");
        $("#unitsm").removeClass("wi-celsius");
        $("#unitsm").addClass("wi-fahrenheit");
        $("#hi-temp").html(degree_maxC);
        $("#lo-temp").html(degree_minC);
        $("#unit-r1").removeClass("wi-fahrenheit");
        $("#unit-r2").removeClass("wi-fahrenheit");
        $("#unit-r1").addClass("wi-celsius");
        $("#unit-r2").addClass("wi-celsius");
    }
    bigC = !bigC;
}

function getWeather(url) {

    $.ajax({
        cache: false,
        url: url,
        success: function (response) {
            var ID = response["weather"][0]["id"];
            setIcon(ID);
            var degree = response["main"]["temp"];
            var degree_min = response["main"]["temp_min"];
            var degree_max = response["main"]["temp_max"];
            degreeC = Math.round(degree - 273.15);
            degreeF = calculateF(degreeC);
            degree_minC = Math.round(degree_min - 273.15);
            degree_minF = calculateF(degree_minC);
            degree_maxC = Math.round(degree_max - 273.15);
            degree_maxF = calculateF(degree_maxC);
            weathertext = response["weather"][0]["description"];
            $("#weathertext").html(weathertext.toUpperCase());
            $("#templg").html(degreeC);
            $("#tempsm").html(degreeF);
            $("#hi-temp").html(degree_maxC);
            $("#lo-temp").html(degree_minC);
        }
    });

}
$(document).ready(function () {
    locationStart();
    $("#t-switch").on("click", function () {
        switchCF(bigC);
    });

});
function console(a) {
    $("#console").html(a);
}



