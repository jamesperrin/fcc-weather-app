/*
jQuery version

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

    function getBeforeSend(xhr) {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.overrideMimeType("application/json; charset=utf-8");
        return xhr;
    }

    function getWeatherByCity(city, done, fail) {
        $.ajax({
            async: false,
            url: "http://api.openweathermap.org/data/2.5/weather",
            beforeSend: getBeforeSend,
            data: {
                q: city,
                units: "imperial",
                appid: "2713fa1dcfc190c2f75f4a17d4de741d"
            },
            method: "GET",
            cache: false
        }).done(done).fail(fail);
    }

    function getWeatherByGeoCodes(lat, lon, done, fail) {
        $.ajax({
            async: false,
            url: "http://api.openweathermap.org/data/2.5/weather",
            beforeSend: getBeforeSend,
            data: {
                lat: lat,
                lon: lon,
                units: "imperial",
                appid: "2713fa1dcfc190c2f75f4a17d4de741d"
            },

            method: "GET",
            cache: false
        }).done(done).fail(fail);
    }

    return {
        GetWeatherByCity: getWeatherByCity,
        GetWeatherByGeoCodes: getWeatherByGeoCodes
    };
}());

//============================================================================================
// JS Singleton Pattern IIFE
// Ref: http://www.codeproject.com/Articles/819565/Javascript-design-patterns-and-IIFE
//============================================================================================
var AppController = (function (svc) {

    var userData = {
        city: "Spokane",
        country: "US",
        lat: 47.673228,
        lon: -117.239375
    };

    function done(data) {
        //console.log(data);

        var outputContainer = $('#output-container');
        var output = $('#output-card');

        var dataFront = $('<ul class="data-front">');
        var dataBack = $('<ul class="data-back">');

        var name = typeof data.name === "undefined" ? "" : data.name;

        var country = typeof data.sys.country === "undefined" ? "" : ", " + data.sys.country;

        var dataCity = $('<ul class="data-city">');

        dataFront.append('<li>' + name + country + '</li>');

        if (typeof data.weather !== "undefined") {
            dataFront.append('<li>' + data.weather[0].description.toProperCase() + '</li>');
        }

        if (data.main.temp !== "undefined") {
            dataFront.append('<li>' + " Temp: " + data.main.temp + "&#176;F" + " / " + AppHelper.Round(AppHelper.FahrenheitToCelsius(data.main.temp), 2) + "&#176;C" +
                '</li>');
        }

        if (data.main.temp_max !== "undefined") {
            dataFront.append('<li>' + "High: " + data.main.temp_max + "&#176;F" + " / " + AppHelper.Round(AppHelper.FahrenheitToCelsius(data.main.temp_max), 2) + "&#176;C" + '</li>');
        }

        if (data.main.temp_min !== "undefined") {
            dataFront.append('<li>' + "Low: " + data.main.temp_min + "&#176;F" + " / " + AppHelper.Round(AppHelper.FahrenheitToCelsius(data.main.temp_min), 2) + "&#176;C" + '</li>');
        }

        var windDirection = typeof data.wind.deg === "undefined" ? "" : AppHelper.WindDegreeToDirection(data.wind.deg);

        var wind = typeof data.wind.speed === "undefined" ? "" : " @ " + data.wind.speed + " MPH";

        if (typeof windDirection !== "undefined" || typeof wind !== "undefined") {
            dataBack.append('<li>Wind: ' + windDirection + wind + '</li>');
        }

        if (typeof data.main.humidity !== "undefined") {
            dataBack.append('<li>' + "Humidity: " + data.main.humidity + "%" + '</li>');
        }

        if (typeof data.visibility !== "undefined") {
            dataBack.append('<li>' + "Visibility: " + AppHelper.Round(AppHelper.MetersToMiles(data.visibility), 2) + " miles" + '</li>');
        }

        if (typeof data.sys.sunrise !== "undefined") {
            dataBack.append('<li>' + "Sunrise: " + AppHelper.FormatDateToTime(AppHelper.UtcTimestampToDate(data.sys.sunrise)) + '</li>');
        }

        if (typeof data.sys.sunset !== "undefined") {
            dataBack.append('<li>' + "Sunset: " + AppHelper.FormatDateToTime(AppHelper.UtcTimestampToDate(data.sys.sunset)) + '</li>');
        }

        output.append(dataFront);
        output.append(dataBack);
        outputContainer.html(output);
    }

    function fail(xhr, ajaxOptions, thrownError) {
        var errorText = JSON.parse(xhr.responseText);

        if (errorText.message !== "Nothing to geocode") {
            toastr["error"]("Something failed!");
        }

        console.log(xhr.responseText);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Exposed Public
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function init() {
        $("#GetWeather").on("click keypress", function (e) {
            var city = $("#city").val();

            if (city.length > -1) {
                //svc.GetWeatherByCity(city, done, fail);
                done(dataTest);
            } else {
                toastr["error"]("Please enter a city.");
            }
        });

        $("button[type=reset]").on("click keypress", function () {
            $("#city").val("");
            $(".output-card").html("");
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
