const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city");
const message = document.querySelector("#message");
const currentWeather = document.querySelector("#current-weather");
const forecast = document.querySelector("#forecast");

const weatherUrl = "https://api.open-meteo.com/v1/forecast";
const locationUrl = "https://geocoding-api.open-meteo.com/v1/search";

form.addEventListener("submit", getWeather);

async function getWeather(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city.";
        return;
    }

    message.textContent = "Loading weather...";
    currentWeather.innerHTML = "";
    forecast.innerHTML = "";

    try {
        const locationResponse = await fetch(
            `${locationUrl}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        const weatherResponse = await fetch(
            `${weatherUrl}?latitude=${location.latitude}&longitude=${location.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
            `&forecast_days=7&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        displayCurrentWeather(location, weatherData);
        displayForecast(weatherData);

        message.textContent = "";
    } catch (error) {
        console.error(error);
        message.textContent = error.message;
    }
}

function displayCurrentWeather(location, weatherData) {
    const current = weatherData.current;

    const weather = getWeatherInfo(current.weather_code);

    currentWeather.innerHTML = `
        <h2>${location.name}, ${location.country}</h2>

        <div class="current-info">
            <div class="weather-icon">${weather.icon}</div>
            <div>
                <div class="temperature">${Math.round(current.temperature_2m)} °C</div>
                <p>${weather.description}</p>
            </div>
        </div>

        <div class="weather-details">
            <div class="detail">
                <strong>Feels Like</strong>
                <p>${Math.round(current.apparent_temperature)} °C</p>
            </div>

            <div class="detail">
                <strong>Humidity</strong>
                <p>${current.relative_humidity_2m}%</p>
            </div>

            <div class="detail">
                <strong>Wind</strong>
                <p>${Math.round(current.wind_speed_10m)} km/h</p>
            </div>
        </div>
    `;
}

function displayForecast(weatherData) {
    forecast.innerHTML = "";

    const daily = weatherData.daily;

    for (let i = 0; i < daily.time.length; i++) {
        const weather = getWeatherInfo(daily.weather_code[i]);

        const card = document.createElement("article");
        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${formatDate(daily.time[i])}</h3>
            <div class="forecast-icon">${weather.icon}</div>
            <p>${weather.description}</p>
            <p class="forecast-temperature">
                ${Math.round(daily.temperature_2m_max[i])} °C /
                ${Math.round(daily.temperature_2m_min[i])} °C
            </p>
            <p>Rain: ${daily.precipitation_probability_max[i] ?? 0}%</p>
        `;

        forecast.appendChild(card);
    }
}

function getWeatherInfo(code) {
    const weather = {
        0: { description: "Clear sky", icon: "☀️" },
        1: { description: "Mainly clear", icon: "🌤️" },
        2: { description: "Partly cloudy", icon: "⛅" },
        3: { description: "Overcast", icon: "☁️" },
        45: { description: "Fog", icon: "🌫️" },
        48: { description: "Fog", icon: "🌫️" },
        51: { description: "Light drizzle", icon: "🌦️" },
        53: { description: "Drizzle", icon: "🌦️" },
        55: { description: "Heavy drizzle", icon: "🌧️" },
        61: { description: "Light rain", icon: "🌦️" },
        63: { description: "Rain", icon: "🌧️" },
        65: { description: "Heavy rain", icon: "🌧️" },
        71: { description: "Light snow", icon: "🌨️" },
        73: { description: "Snow", icon: "🌨️" },
        75: { description: "Heavy snow", icon: "❄️" },
        80: { description: "Rain showers", icon: "🌦️" },
        81: { description: "Rain showers", icon: "🌧️" },
        82: { description: "Heavy rain showers", icon: "⛈️" },
        95: { description: "Thunderstorm", icon: "⛈️" }
    };

    return weather[code] || {
        description: "Unknown weather",
        icon: "🌡️"
    };
}

function formatDate(date) {
    const dateObject = new Date(`${date}T12:00:00`);

    return dateObject.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}

// Start with a default city.
cityInput.value = "San Nicolas de los Arroyos";
getWeather(new Event("submit"));
