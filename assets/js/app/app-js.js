/*
Vanilla JavaScript version

Project: FCC Show the Local Weather
File Name: app-jq.js
Date: 06/01/2017
Programmer: James Perrin
REF: https://www.freecodecamp.com/challenges/show-the-local-weather
*/
"use strict";

var dataTest = {
    "coord": {
        "lon": -117.24,
        "lat": 47.67
    },
    "weather": [{
        "id": 803,
        "main": "Clouds",
        "description": "broken clouds",
        "icon": "04d"
    }],
    "base": "stations",
    "main": {
        "temp": 55.98,
        "pressure": 1011,
        "humidity": 41,
        "temp_min": 53.6,
        "temp_max": 60.8
    },
    "visibility": 16093,
    "wind": {
        "speed": 13.87,
        "deg": 240,
        "gust": 8.2
    },
    "clouds": {
        "all": 75
    },
    "dt": 1497030780,
    "sys": {
        "type": 1,
        "id": 2956,
        "message": 0.0053,
        "country": "US",
        "sunrise": 1497009062,
        "sunset": 1497066371
    },
    "id": 5811729,
    "name": "Spokane Valley",
    "cod": 200
};

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    //var str = "foo bar baz"
    //str.split(' ')
    //   .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    //   .join(' ');
};

// Service to retrieve weather data from OpenWeatherMap.org API
var ServiceOpenWeatherMap = (function () {
    var units = "imperial";
    var appid = "2713fa1dcfc190c2f75f4a17d4de741d";

    function getBeforeSend(xhr) {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.overrideMimeType("application/json; charset=utf-8");
        return xhr;
    }

    function getWeatherByCity(city, done, fail) {
        var client = new XMLHttpRequest();

        client.onload = function () {
            if (this.readyState == 4 && this.status == 200) {
                //if (this.status >= 200 && this.status < 400) {
                // success!
                done(JSON.parse(this.responseText));
            } else {
                // something went wrong
                fail(this.responseText);
            }
        };

        client.onerror = fail;

        var url = "https://crossorigin.me/http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + appid;

        client.open("GET", url);
        client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        client.setRequestHeader("Accept", "application/json");
        client.overrideMimeType("application/json; charset=utf-8");
        client.send();
    }

    return {
        GetWeatherByCity: getWeatherByCity
    };
}());

//============================================================================================
// JS Singleton Pattern IIFE
// Ref: http://www.codeproject.com/Articles/819565/Javascript-design-patterns-and-IIFE
//============================================================================================
var AppController = (function (svc) {

    function fail(xhr) {
        //console.log(xhr);
        var msg = "Something failed!";

        if (typeof xhr !== "undefined") {
            var errorText = JSON.parse(xhr);
            msg += "<br/> HTTP " + errorText.cod + ": " + errorText.message.toProperCase();
        }

        toastr["error"](msg);
    }

    function GetWeather() {
        var city = document.getElementById("city").value;

        if (city.length > 0) {
            svc.GetWeatherByCity(city, done, fail);
            //done(dataTest);
        } else {
            toastr["error"]("Please enter a city.");
        }
    }

    function ResetPage() {
        document.getElementById("city").value = "";
        document.getElementById("output-card").innerHTML = "";
    }

    function UlAppendLi(Message, UlElement) {
        var node = document.createElement("li");
        node.innerHTML = Message;
        UlElement.appendChild(node);
    }

    function done(data) {
        //console.log(data);

        var outputContainer = document.getElementById("output-container");
        var output = document.getElementById("output-card");

        var dataFront = document.createElement("ul");
        dataFront.classList.add("data-front");

        var dataBack = document.createElement("ul");
        dataBack.classList.add("data-back");

        if (typeof data.name !== "undefined") {
            var name = data.name;
            var country = typeof data.sys.country === "undefined" ? "" : ", " + data.sys.country;
            var msg = name + country;
            UlAppendLi(msg, dataFront);
        }

        if (typeof data.weather !== "undefined") {
            var msg = data.weather[0].description.toProperCase();
            UlAppendLi(msg, dataFront);
        }

        if (typeof data.main.temp !== "undefined") {
            var node = document.createElement("li");
            var msg = "Temp: " + data.main.temp + "&#176;F" + " / " + AppHelper.Round(AppHelper.FahrenheitToCelsius(data.main.temp), 2) + "&#176;C";
            UlAppendLi(msg, dataFront);
        }

        if (data.main.temp_max !== "undefined") {
            var msg = "High: " + data.main.temp_max + "&#176;F" + " / " + AppHelper.Round(AppHelper.FahrenheitToCelsius(data.main.temp_max), 2) + "&#176;C";
            UlAppendLi(msg, dataFront);
        }

        if (data.main.temp_min != null) {
            var msg = "Low: " + data.main.temp_min + "&#176;F" + " / " + AppHelper.Round(AppHelper.FahrenheitToCelsius(data.main.temp_min), 2) + "&#176;C";
            UlAppendLi(msg, dataFront);
        }

        var windDirection = typeof data.wind.deg === "undefined" ? "" : AppHelper.WindDegreeToDirection(data.wind.deg);

        var wind = typeof data.wind.speed === "undefined" ? "" : " @ " + data.wind.speed + " MPH";

        if (typeof windDirection !== "undefined" || typeof wind !== "undefined") {
            var msg = 'Wind: ' + windDirection + wind;
            UlAppendLi(msg, dataBack);
        }

        if (typeof data.main.humidity !== "undefined") {
            var msg = "Humidity: " + data.main.humidity + "%";
            UlAppendLi(msg, dataBack);
        }

        if (typeof data.visibility !== "undefined") {
            var msg = "Visibility: " + AppHelper.Round(AppHelper.MetersToMiles(data.visibility), 2) + " miles";
            UlAppendLi(msg, dataBack);
        }

        if (typeof data.sys.sunrise !== "undefined") {
            var msg = "Sunrise: " + AppHelper.FormatDateToTime(AppHelper.UtcTimestampToDate(data.sys.sunrise));
            UlAppendLi(msg, dataBack);
        }

        if (typeof data.sys.sunset !== "undefined") {
            var msg = "Sunset: " + AppHelper.FormatDateToTime(AppHelper.UtcTimestampToDate(data.sys.sunset));
            UlAppendLi(msg, dataBack);
        }

        output.appendChild(dataFront);
        output.appendChild(dataBack);
    }

    function InputKeydownEvevnt(e) {
        //console.log(e);

        if (e.keyCode == "13") {
            GetWeather();
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Exposed Public
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function init() {
        //REF: https://stackoverflow.com/questions/11845678/adding-multiple-event-listeners-to-one-element
        var events = "click keypress";

        var divGetWeather = document.getElementById("GetWeather");

        //divGetWeather.addEventListener("click", GetWeather);
        //divGetWeather.addEventListener("keypress", GetWeather);
        events.split(" ").forEach(function (el) {
            divGetWeather.addEventListener(el, GetWeather, false)
        });

        var inputCity = document.getElementById("city");
        inputCity.addEventListener("keydown", InputKeydownEvevnt, false);

        var btnReset = document.querySelector("button[type=reset]");

        //btnReset.addEventListener("click", ResetPage);
        //btnReset.addEventListener("keypress", ResetPage);
        events.split(" ").forEach(function (el) {
            btnReset.addEventListener(el, ResetPage, false)
        });
    }

    return {
        init: init
    };
}(ServiceOpenWeatherMap));

// jQuery Ready event
$(function () {
    AppController.init();
});
