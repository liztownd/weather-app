$(document).ready(function () {

    var searchName = "";
    var searchHistory = [];
    var lat;
    var long;
    var unixtimestamp;
    //   var convdataTime;
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

        if (searchHistory === null) {
            return
        }
        else {

            searchName = searchHistory[searchHistory.length - 1];

            currentCond();
            futureCond();
            renderHistoryBtns();
        }
    }; //getLS end tag


    $("#search").on("click", function () {

        $("#cityName").html("");
        $("#currentCond").html("");
        $("#uv").html("");
        $("#futureCond").html("");

        searchName = $("#searchName").val().trim();

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


        localStorage.setItem("history", JSON.stringify(searchHistory));

        currentCond();
        futureCond();
        renderHistoryBtns();


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
            $("#historyBtns").append(historyBtn);
            }
        }

    }; //renderHistoryBtns end tag


    $("historyBtn").on("click", function () {
        console.log("test");
        searchName = $(this).data-value.val();

        currentCond();
        futureCond();

    }); //histBtn on click end tag



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

            var city = $("<h2>").text(currentData.name + " (" + mo + " " + da + ", " + ye + ") ").attr("class", "float-left");
            var condIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + currentData.weather[0].icon + ".png");
            condIcon.attr("class", "clear-float");
            $("#cityName").append(city, condIcon);


            var K = currentData.main.temp;
            var F = (1.8 * (K - 273) + 32).toFixed(1);
            var temp = $("<p>").text("Temperature : " + F + " F");

            var hum = $("<p>").text("Humidity : " + currentData.main.humidity + "%");

            var wind = $("<p>").text("Wind Speed : " + currentData.wind.speed + " MPH");

            $("#currentCond").append(temp, hum, wind);

            uvCond();


        });//ajax.then call end tag

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
            $("#uv").append("UV Index : " + uv);


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

    function futureCond() {

        var futureURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchName + "&appid=cbd3aab5a681fb72ebf5cc9991e5f320";

        $.ajax({
            url: futureURL,
            method: "GET",
        }).then(function (futureData) {
            console.log(futureData);

            for (i = 0; i < futureData.list.length; i++);




        });//ajax.then call end tag

    }; // futureCond func end tag


}); //doc ready end tag