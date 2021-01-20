$(document).ready(function () {

    var searchName = "";
    var lastSearch = "";
    var searchHistory = [];
    var lat;
    var long;
    var unixtimestamp;
    var mo;
    var da;
    var ye;

    //on load - get local storage data 

    getLS();

    //render history buttons
    //load info for most recent search (using last index of history array)  
    //search for city - onclick
    //get history from local storage
    //check to see if it's been searched before
    //add to list if it's new, send list to local storage
    //generate buttons from search history

    function getLS() {
        searchHistory = JSON.parse(localStorage.getItem("history"));
        lastSearch = localStorage.getItem("last");

        if (lastSearch === null && searchHistory === null) {
            return
        }
        else {

            searchName = lastSearch;

            currentCond();
            //  oneCall();
            renderHistoryBtns();
        }
    }; //getLS end tag


    $("#search").on("click", function () {

        $("#cityName").html("");
        $("#currentCond").html("");
        $("#uv").html("");
        $("#futureCond").html("");

        searchName = $("#searchName").val().trim();
        lastSearch = searchName;

        console.log(searchName);

        searchHistory = JSON.parse(localStorage.getItem("history"));

        if (searchHistory === null) {
            searchHistory = [searchName];
        }

        else if ($.inArray(searchName, searchHistory) === -1) {
            searchHistory.push(searchName);
        }
        else {
            //error message?
        }

        localStorage.setItem("last", lastSearch);
        localStorage.setItem("history", JSON.stringify(searchHistory));

        currentCond();
        //   oneCall();
        renderHistoryBtns();

      //  $("#searchName").attr("placeholder", "City Name");



    }); //onclidk end tag



    function renderHistoryBtns() {

        searchHistory = JSON.parse(localStorage.getItem("history"));
        console.log(searchHistory);

        if (searchHistory === null) {
            return
        }

        else {
            $("#historyBtns").html("");
            for (i = 0; i < searchHistory.length; i++) {
                console.log(searchHistory);
                console.log(searchHistory[i]);
                var historyBtn = $("<button>").attr("class", "btn btn-outline-info mt-3");
                historyBtn.text(searchHistory[i]);
                historyBtn.attr("data-value", searchHistory[i]);
                $("#historyBtns").prepend(historyBtn);
            }
        }

    }; //renderHistoryBtns end tag


    $(document).on("click", ".btn-outline-info", function () {
        $("#currentCond").html("");
        $("#futureCond").html("");
        $("#cityName").html("");

        $("#uv").html("");

        console.log("test");
        console.log(this);
        searchName = $(this).data("value");
        console.log(searchName);

        currentCond();
        //   oneCall();

    }); //histBtn on click end tag

    $("#clear").on("click", function () {
        localStorage.clear();

        $("#historyBtns").html("");

    }); //clear button end tag

    //API calls for current conditions and one for future conditions
    //get/set data for current conditions
    //append page

    function currentCond() {

        var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchName + "&appid=cbd3aab5a681fb72ebf5cc9991e5f320";

        $.ajax({
            url: currentURL,
            method: "GET",
        }).then(function (currentData) {
            console.log(currentData);

            lat = parseInt(currentData.coord.lat);
            long = parseInt(currentData.coord.lon);
            unixtimestamp = parseInt(currentData.dt);

            convertUnixDate();
            oneCall();

            var city = $("<h2>").text(currentData.name + " (" + mo + " " + da + ", " + ye + ") ").attr("class", "float-left");
            var condIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + currentData.weather[0].icon + ".png");
            condIcon.attr("class", "clear-float");
            $("#cityName").append(city, condIcon);


            var K = currentData.main.temp;
            var F = (1.8 * (K - 273) + 32).toFixed(1);
            var temp = $("<p>").text("Temperature : " + F + "\u00B0 F");

            var hum = $("<p>").text("Humidity : " + currentData.main.humidity + "%");

            var wind = $("<p>").text("Wind Speed : " + currentData.wind.speed + " MPH");

            $("#currentCond").append(temp, hum, wind);

            uvCond();


        })
        
        // .error(function(){
        //     alert=("Invalid City Name");


        // }) 

    }; // currentCond func end tag

    //UV Index call

    function uvCond() {

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=cbd3aab5a681fb72ebf5cc9991e5f320";

        $.ajax({
            url: uvURL,
            method: "GET",
        }).then(function (uvData) {
            console.log(uvData);
            var uv = uvData.value;
            var uvColor = $("<span>").text(uv);

            if (uv <= 3) {
                uvColor.attr("class", "bg-success p-2 text-light rounded-sm");
            }
            else if (uv > 3 && uv <= 8) {
                uvColor.attr("class", "bg-warning p-2 text-light rounded-sm");
            }

            else if (uv > 8 && uv <= 10) {
                uvColor.attr("class", "bg-danger p-2 text-light rounded-sm");
            }


            $("#uv").append("UV Index : ");
            $("#uv").append(uvColor);



        });//ajax.then call end tag

    }; // uvCond func end tag

    function convertUnixDate() {

        var milliseconds = unixtimestamp * 1000;
        var dateObject = new Date(milliseconds);

        ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dateObject);
        mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObject);
        da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dateObject);
    };

    //get/set data for future conditions
    //append page


    function oneCall() {

        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly&units=imperial&appid=cbd3aab5a681fb72ebf5cc9991e5f320";

        $.ajax({
            url: oneCallURL,
            method: "GET",
        }).then(function (oneData) {
            console.log(oneData);

            var forecastHeader = $("<div>").attr("class", "h3").text("Five Day Forecast");
            var futureDiv = $("<div>");

            var data = oneData.daily;

            for (i = 0; i < 5; i++) {

                var day = $("<div>").attr("class", "card m-1 p-2 text-light bg-primary float-left");


                var dailyHigh = $("<p>").text("High : " + data[i].temp.max.toFixed(1) + "\u00B0 F");
                var dailyIconId = data[i].weather[0].icon;
                console.log(dailyIconId);
                var dailyIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dailyIconId + "@2x.png");
                var dailyHum = $("<p>").text("Humidity : " + data[i].humidity + "%");
                unixtimestamp = data[i].dt;

                convertUnixDate();

                var forcecastDate = $("<p>").attr("class", "h5").text(mo + " " + da + ", " + ye);

                day.append(forcecastDate, dailyIcon, dailyHigh, dailyHum);

                futureDiv.append(day);


            };

            $("#futureCond").append(forecastHeader, futureDiv);


        }) //ajax.then end tag

    }; //one call end tag

}); //doc ready end tag