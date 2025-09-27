// Hardcoded weather data for demo
const weatherData = {
  "New York": { temp: 22, desc: "Sunny" },
  London: { temp: 18, desc: "Cloudy" },
  Paris: { temp: 20, desc: "Partly Cloudy" },
  Tokyo: { temp: 25, desc: "Clear" },
  Mumbai: { temp: 30, desc: "Humid" },
};

const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherResult = document.getElementById("weatherResult");

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.textContent = "Please enter a city name.";
    return;
  }
  const weather = weatherData[city];
  if (weather) {
    weatherResult.textContent = `${city}: ${weather.temp}°C, ${weather.desc}`;
  } else {
    weatherResult.textContent = `Weather data for '${city}' not found.`;
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherBtn.click();
  }
});
