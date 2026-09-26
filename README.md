# CSE 341 Weather Forecast

A simple weather application built with:

- HTML
- CSS
- Vanilla JavaScript
- Open-Meteo API

## Features

- Search for a city.
- Display current temperature.
- Display feels-like temperature.
- Display humidity.
- Display wind speed.
- Display weather conditions.
- Display a 7-day forecast.
- Display precipitation probability.

## How to run

Open `index.html` with VS Code Live Server.

No framework or JavaScript library is required.

## How the application works

1. The user enters a city.
2. JavaScript sends the city to the Open-Meteo Geocoding API.
3. The API returns latitude and longitude.
4. JavaScript uses those coordinates with the Open-Meteo Weather API.
5. The application displays the weather by changing the HTML with JavaScript.
