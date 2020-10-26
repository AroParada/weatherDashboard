// vars
var searchInput = $("input");
var searchBtn = $("button");
var searchHistoryEL = $("#searchhistory");
var currentWeatherEL = $("#currentWeatherBody");
var fiveDayForecastEl = $("#cardBox");
var searchCity = "New York City";
var currentWeatherObj;
var fiveDayForecastObj;
var cityLongited = "";
var cityLatitude = "";
var savedSearches = ["New York City", "Boston", "Los Angeles", "San Francisco", "Chicago"];

// history clicked
$("#searchhistory").on("click", function(event) {
    
    searchCity = event.target.innerHTML
    console.log(searchCity);
    localStorage.setItem("searchCity", searchCity);
    loadSavedSearches();
    getCurrentWeather();
    getFiveDayForcast();
    
});

// button click
    $("#button-addon2").on("click" , function(event) {
    
        writeToLocalStorage();
        loadSavedSearches();
        getCurrentWeather();
        getFiveDayForcast();
});


// openWeather API AJAX Call
function getCurrentWeather () {

    var key = "e4b0481784f4f924725342b1ffaf41d0";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=" + key;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        // console.log(response);
        currentWeatherObj = response
        currentWeatherIcon = currentWeatherObj.weather[0].icon;
        // console.log(currentWeatherIcon);
        displayCurrentWeather();
        cityLongited = currentWeatherObj.coord.lon;
        cityLatitude = currentWeatherObj.coord.lat;
        getUVIndex();


    });
};

function getFiveDayForcast () {
    var key = "2fd6a7c1addf009b30af95d20e54bde2";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&appid=" + key;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        // console.log(response);
        fiveDayForecastObj = response;
        // console.log(fiveDayForecastObj);
        displayFiveDayForcast();
    });
};


// functions

// load saved searches

function loadSavedSearches() {

    searchHistoryEL.empty();
    if (localStorage.getItem("searchCity") !== null) {
    searchCity = localStorage.getItem("searchCity")
    };
    var localSearches = localStorage.getItem("searches");
    var parsedLocalSearches = JSON.parse(localSearches);
    if (parsedLocalSearches !== null) {
    savedSearches = parsedLocalSearches;
    }




    for (i = 0; i < 11; i++) {

    var listEL = $("<button>" + savedSearches[i] + "</button>").attr("class", "btn btn-outline-dark").attr("id", "savedcitybtn");
    
    
    searchHistoryEL.append(listEL);

      }

    
}

//Write to local storage 

function writeToLocalStorage() {

    var cityInput = searchInput.val();
    if (cityInput !== "") {
    console.log(cityInput);
    searchCity = cityInput;
    savedSearches.unshift(cityInput);
    var stringifiedSavedSearches = JSON.stringify(savedSearches);
    localStorage.setItem("searches", stringifiedSavedSearches);
    localStorage.setItem("searchCity", searchCity);
    }

}

//display current weather
function displayCurrentWeather() {
    $("#citynamedateandweather").empty();
    $("#temperature").empty();
    $("#humidityPercent").empty();
    $("#windspeed").empty();
    $("#weatherText").empty();

    var currentCity = currentWeatherObj.name;
    var currentTemp = currentWeatherObj.main.temp;
    var currentHumidity = currentWeatherObj.main.humidity;
    var currentWindSpeed = currentWeatherObj.wind.speed;
    var currentWeatherTxt = currentWeatherObj.weather[0].main + ": " + currentWeatherObj.weather[0].description;
    var cityNameAndDate = $("<h5>").text(currentCity + " (" + currentDate + ") ");
    var weatherText = $("<h6>").text(currentWeatherTxt);
    var tempatureEl = $("<h6>").text("Temperature: " + currentTemp + " \u00B0F");
    var humidityEl = $("<h6>").text("Humidity: " + currentHumidity + " %");
    var windSpeedEl = $("<h6>").text("Wind Speed: " + currentWindSpeed + " MPH");

    $("#citynamedateandweather").append(cityNameAndDate);
    $("#cityWeatherImg").attr("src", "https://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    $("#weatherText").append(weatherText);
    $("#temperature").append(tempatureEl);
    $("#humidityPercent").append(humidityEl);
    $("#windspeed").append(windSpeedEl);

    

}


//display five day forecast
function displayFiveDayForcast() {

    $(fiveDayForecastEl).html("");

    for (var i = 0; i < 5; i++) {

        var someDate = new Date();
        var numberOfDaysToAdd = i + 1;
        someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();

        var futureDates = mm + '/'+ dd + '/'+ y;
        

    var fiveDayCardEl = $("<div>").attr("class", "card forecastBox");
    var indexNumber = 7 + (8 * i);
    var forecastIcon = fiveDayForecastObj.list[indexNumber].weather[0].icon;
    var forecastIconImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + forecastIcon + ".png").attr("id", "forcastImgIcon");
    var temperature = fiveDayForecastObj.list[indexNumber].main.temp_max;
    var humidity = fiveDayForecastObj.list[indexNumber].main.humidity;


    // console.log(7 +(8 * i));
    $(fiveDayCardEl).append(futureDates);
    $(fiveDayCardEl).append(forecastIconImg);
    $(fiveDayCardEl).append("Temp: " + temperature + " \u00B0F ");
    $(fiveDayCardEl).append("Humidity: " + humidity + "%");

    $(fiveDayForecastEl).append(fiveDayCardEl);
      }
}

//get current date
function getCurrentDate () {
    var fullDate = new Date()
 
//convert month to 2 digits
var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '' + (fullDate.getMonth()+1);
 
currentDate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear();
}


// function calls
loadSavedSearches();
getCurrentDate();
getCurrentWeather();
getFiveDayForcast();

