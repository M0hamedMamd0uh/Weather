let temp = document.getElementById("temp");
let city = document.getElementById("city");
let cityTime = document.getElementById("cityTime");
let weatherStatusImg = document.getElementById("weatherStatusImg");
let weatherStatus = document.getElementById("weatherStatus");
let cloudy = document.getElementById("cloudy");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let uv = document.getElementById("uv");

let mintemp = document.querySelectorAll("#mintemp");
let maxtemp = document.querySelectorAll("#maxtemp");

let nextday = document.getElementById("nextday");
let nextnextday = document.getElementById("nextnextday");

let tempForecast = document.querySelectorAll("#tempForecast");

let inputValue = document.getElementById("inputValue");
let country = document.getElementById("country");
// let continent = document.getElementById("continent");

let cityLocation = "toukh";
let today = null;
var month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (result) => {
      cityLocation = `${result.coords.latitude},${result.coords.longitude}`;
      getData("current", cityLocation);
      getAllDate();
    },
    () => {
      getData("current", cityLocation);
      getAllDate();
    }
  );
}

async function getData(apiMethod, parameter, days) {
  let myReq = await fetch(
    `http://api.weatherapi.com/v1/${apiMethod}.json?key=03494007fe874e5587e132847230408&q=${parameter}&days=${days}`
  );
  let myData = await myReq.json();
  return myData;
}

async function getAllDate() {
  await getData("current", cityLocation).then((result) => {
    let x = new Date(result.location.localtime);

    country.innerHTML = result.location.country;

    // continent.innerHTML = result.location.tz_id;

    temp.innerHTML = Math.round(result.current.temp_c);
    city.innerHTML = result.location.name;
    cityTime.innerHTML = `${x.toString().split(" ")[4].slice(0, 5)} - ${
      dayNames[x.getDay()]
    }, ${x.getDate()} ${month[x.getMonth()]} ${x.getFullYear()}`;
    weatherStatusImg.setAttribute(
      "src",
      `https:${result.current.condition.icon}`
    );

    weatherStatusImg.addEventListener("error", function (event) {
      event.target.src = "images/cloudy.png";
      event.onerror = null;
    });

    weatherStatus.innerHTML = result.current.condition.text;

    cloudy.innerHTML = `${result.current.cloud}%`;
    humidity.innerHTML = `${result.current.humidity}% `;
    wind.innerHTML = `${result.current.wind_kph} Km/h --- <i class="fa-regular fa-compass w-auto"></i> ${result.current.wind_dir}`;
    uv.innerHTML = result.current.uv;
  });

  await getData("forecast", cityLocation, 3).then((result) => {
    for (let i = 0; i < mintemp.length; i++) {
      mintemp[i].innerHTML = Math.round(
        result.forecast.forecastday[i].day.mintemp_c
      );
      maxtemp[i].innerHTML = Math.round(
        result.forecast.forecastday[i].day.maxtemp_c
      );

      let date = new Date(result.forecast.forecastday[i].date);
      if (i === 1) nextday.innerHTML = dayNames[date.getDay()];
      if (i === 2) nextnextday.innerHTML = dayNames[date.getDay()];
    }

    let counter = 0;
    for (let x = 0; x < result.forecast.forecastday[0].hour.length; x += 3) {
      tempForecast[counter++].innerHTML = Math.round(
        result.forecast.forecastday[0].hour[x].temp_c
      );
    }
  });
}

inputValue.oninput = async function (e) {
  if (e.target.value.length < 3) {
    inputValue.classList.remove("is-valid");
    inputValue.classList.remove("is-invalid");
    return;
  } else {
    cityLocation = e.target.value;

    let result = await getData("current", cityLocation);

    // for add valid and in-valid class to search input
    if (result.error === undefined) {
      inputValue.classList.add("is-valid");
      inputValue.classList.remove("is-invalid");
    } else {
      inputValue.classList.remove("is-valid");
      inputValue.classList.add("is-invalid");
    }

    getData("current", cityLocation);
    getAllDate();
  }
};

