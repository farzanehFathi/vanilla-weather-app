function formatDate(timestamp) {
  let date = new Date(timestamp);
  let dayNumber = date.getDay();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Satuday",
  ];

  return `${weekDays[dayNumber]}. ${hour}:${minute}`;
}

function formatDay(timestamp) {
  date = new Date(timestamp * 1000);
  dayNumber = date.getDay();
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${weekDays[dayNumber]}`;
}

function formatIcons(icon) {
  let iconList = [
    "clear-sky-day",
    "few-clouds-day",
    "scattered-clouds-day",
    "broken-clouds-day",
    "shower-rain-day",
    "rain-day",
    "thunderstorm-day",
    "snow-day",
    "mist-day",
    "clear-sky-night",
    "few-clouds-night",
    "scattered-clouds-night",
    "broken-clouds-night",
    "shower-rain-night",
    "rain-night",
    "thunderstorm-night",
    "snow-night",
    "mist-night",
  ];

  let CodeList = [
    "01d",
    "02d",
    "03d",
    "04d",
    "09d",
    "10d",
    "11d",
    "13d",
    "50d",
    "01n",
    "02n",
    "03n",
    "04n",
    "09n",
    "10n",
    "11n",
    "13n",
    "50n",
  ];
  iconCode = CodeList[iconList.indexOf(icon)];

  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function displayForecast(respond) {
  let forecastDays = respond.data.daily.slice(0, 5);
  let forecastRow = document.querySelector("#forecast-row");
  let forecastElement = "";
  forecastDays.forEach(function (day) {
    forecastElement =
      forecastElement +
      `<div class="col-2 forecast-block">
                <div class="forecast-day">${formatDay(day.time)}</div>
                <img
                  src=${formatIcons(day.condition.icon)}
                  alt=${day.condition.description}
                  class="forecast-icon"
                />
                <div>
                  <span class="forecast-temp-max">${Math.round(
                    day.temperature.maximum
                  )}°</span>
                  <span class="forecast-temp-min">${Math.round(
                    day.temperature.minimum
                  )}°</span>
                </div>
                         </div>`;
  });
  forecastRow.innerHTML = forecastElement;
}

function getForecast(city) {
  //data from sheCodes
  apiKey = "0c78073fed5355o034190aeb4t4430f6";
  apiURL = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiURL).then(displayForecast);
}

function updateWeather(respond) {
  //Update Icon
  let iconCode = respond.data.weather[0].icon;
  let description = respond.data.weather[0].main;
  let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.querySelector("#weather-icon").setAttribute("src", iconUrl);
  document.querySelector("#weather-icon").setAttribute("alt", description);

  //Update Weather Elements
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#temperature").innerHTML = Math.round(
    respond.data.main.temp
  );

  document.querySelector("#city-name").innerHTML = respond.data.name;

  document.querySelector("#feels-like").innerHTML = `${Math.round(
    respond.data.main.feels_like
  )}°C`;
  document.querySelector("#humidity").innerHTML = Math.round(
    respond.data.main.humidity
  );
  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    respond.data.wind.speed
  )} Km/h`;

  //Send date for formatDate function
  document.querySelector("#date").innerHTML = formatDate(
    respond.data.dt * 1000
  );

  //Send date for getForecast function
  getForecast(respond.data.name);

  //Update global pars
  celsiusTemperature = respond.data.main.temp;
  feelsLike = respond.data.main.feels_like;
  windSpeed = respond.data.wind.speed;

  //Night mode ---- Bug
  // isNight = respond.data.dt > respond.data.sys.sunset;
  // nightMode(isNight);
}

function search(city) {
  let apiKey = "32e12816b7e874a17bd13105b642a985";
  let unit = "metric";
  let Url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(Url).then(updateWeather);
}

function handleSubmitButton(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#input-city").value;
  search(cityInput);
  document.querySelector("#input-city").value = null;
}

function toFahrenheit(event) {
  event.preventDefault();
  fahrenheitLink.classList.add("deactive");
  celsiusLink.classList.remove("deactive");
  document.querySelector("#temperature").innerHTML = `${Math.round(
    (celsiusTemperature * 9) / 5 + 32
  )}`;
  document.querySelector("#feels-like").innerHTML = `${
    Math.round((feelsLike * 9) / 5) + 32
  }°F`;
  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    windSpeed / 1.609
  )} mph`;
}

function toCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("deactive");
  fahrenheitLink.classList.remove("deactive");
  document.querySelector("#temperature").innerHTML = `${Math.round(
    celsiusTemperature
  )}`;
  document.querySelector("#feels-like").innerHTML = `${Math.round(
    feelsLike
  )}°C`;
  document.querySelector("#wind-speed").innerHTML = `${Math.round(
    windSpeed
  )} Km/h`;
}

// Search form
let form = document.querySelector("#search");
form.addEventListener("submit", handleSubmitButton);

search("London");

// Define global pars
let celsiusTemperature = document.querySelector("#temperature").innerHTML;
let feelsLike = document.querySelector("#feels-like").innerHTML;
let windSpeed = document.querySelector("#wind-speed").innerHTML;

// Converting units
let fahrenheitLink = document.querySelector("#to-fahrenheit");
fahrenheitLink.addEventListener("click", toFahrenheit);

let celsiusLink = document.querySelector("#to-celsius");
celsiusLink.addEventListener("click", toCelsius);

// function nightMode(isNight) {
//   if (isNight) {
//     console.log("it is night");
//   } else {
//     console.log("it is not night");
//     city = document.querySelector("#city-name");
//     temp = document.querySelector("#temperature");
//     body = document.querySelector("body");

//     body.classList.add("night-mode");
//     city.classList.add("night-mode-text");
//     city.classList.add("night-mode-text");
//   }
// }
