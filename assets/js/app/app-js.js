/*
Project: FCC Build a Random Quote Machine
File Name: app-js.js
Date: 05/02/2017
Programmer: James Perrin
REF: https://www.freecodecamp.com/challenges/build-a-random-quote-machine
*/

// Service to retrieve quote from Mashape.com API
var ServiceMashape = (function () {
    "use strict";

    function getQuote(done, fail) {

        var request = new XMLHttpRequest();
        request.open('POST', 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1', true);
        request.setRequestHeader("X-Mashape-Key", "KUQMDIvEi6mshYLdBtps8CIxTdsvp111rnhjsnCvUeXWkcgSNr");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", "application/json");
        request.overrideMimeType("application/json; charset=utf-8");

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;
                done(resp);

            } else {
                // We reached our target server, but it returned an error
                fail();
            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
            fail();
        };

        request.send();
    }

    return {
        GetQuote: getQuote
    };
}());

//============================================================================================
// JS Singleton Pattern IIFE
// Ref: http://www.codeproject.com/Articles/819565/Javascript-design-patterns-and-IIFE
//============================================================================================
var AppController = (function (svc) {
    "use strict";

    function doneMashape(data) {
        console.log(data);
        var myData = JSON.parse(data);
        var quote = document.getElementById("quote");
        var author = document.getElementById("author");
        quote.innerHTML = myData.quote;
        author.innerHTML = myData.author;
    }

    function fail() {
        toastr["error"]("Something failed!");
    }

    function TweetQuote() {
        var quoteH2 = document.getElementById("quote");
        var authorSpan = document.getElementById("author");
        var quote = quoteH2.textContent.trim();
        var author = " ~ " + authorSpan.textContent.trim();

        var strWindowFeatures = "location=yes,left=75%,top=25%,height=400,width=700,scrollbars=yes,status=yes";

        var tweetUrl = 'https://twitter.com/intent/tweet?text=' + quote + author;

        var windowName = "TWEET WINDOW";

        window.open(tweetUrl, "", strWindowFeatures);
    }



    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Exposed Public
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function init() {

        function GetService() {
            svc.GetQuote(doneMashape, fail);
        }

        var btnGetNewQuote = document.getElementById("GetNewQuote");

        var btnTweet = document.getElementById("Tweet");

        btnGetNewQuote.addEventListener("click", GetService);
        btnGetNewQuote.addEventListener("keypress", GetService);

        btnTweet.addEventListener("click", TweetQuote);

        btnTweet.addEventListener("keypress", TweetQuote);

        //btnGetNewQuote.dispatchEvent("click");
    }

    return {
        init: init
    };
}(ServiceMashape));

// jQuery Ready event
$(function () {
    "use strict";
    AppController.init();
});
