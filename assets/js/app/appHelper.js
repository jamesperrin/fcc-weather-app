/*!
 * AppHelper
 *
 *
 * Date: 2017-03-20T18:59Z
 */
(function () {
    "use strict";
    var AppHelper = {};

    function Round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    function CelsiusToFahrenheit(Celsius) {
        return (Celsius * 9 / 5) + 32;
    }

    function CelsiusToKelvin(C) {
        return (Celsius + 273.15);
    }

    function FahrenheitToCelsius(Fahrenheit) {
        return (Fahrenheit - 32) * 5 / 9;
    }

    function FahrenheitToKelvin(Fahrenheit) {
        return (Fahrenheit - 32) * 5 / 9 + 273.15;
    }

    function KelvinToCelsius(Kelvin) {
        return (Kelvin - 273.15);
    }

    function KelvinToFahrenheit(Kelvin) {
        return (Kelvin - 273.15) * 9 / 5 + 32;
    }

    function UtcTimestampToDate(UnixTimestamp) {
        return new Date(UnixTimestamp * 1000);
    }

    function FormatDateToTime(datetime) {
        var date = datetime;
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    /*
     Converts wind direction in degrees to compass directions
     e.g. 180 degrees equals S
     */
    function WindDegreeToDirection(WindDegree) {

        /*
         * How to Convert Wind Directions in Degrees to Compass Directions
         * https://www.campbellsci.com/blog/convert-wind-directions
         */
        var windDirection = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

        var dirIndex = (Math.round((WindDegree % 360) / 22.5) + 1) - 1;

        return windDirection[dirIndex];
    }

    function MetersToMiles(meters) {
        return meters * 0.0006214;
    }

    AppHelper.Round = Round;
    AppHelper.CelsiusToFahrenheit = CelsiusToFahrenheit;
    AppHelper.CelsiusToKelvin = CelsiusToKelvin;
    AppHelper.FahrenheitToCelsius = FahrenheitToCelsius;
    AppHelper.FahrenheitToKelvin = FahrenheitToKelvin;
    AppHelper.KelvinToCelsius = KelvinToCelsius;
    AppHelper.KelvinToFahrenheit = KelvinToFahrenheit;
    AppHelper.UtcTimestampToDate = UtcTimestampToDate;
    AppHelper.WindDegreeToDirection = WindDegreeToDirection;
    AppHelper.FormatDateToTime = FormatDateToTime;
    AppHelper.MetersToMiles = MetersToMiles;


    window.AppHelper = AppHelper;

    return AppHelper
})();
