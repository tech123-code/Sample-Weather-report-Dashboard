const API_KEY = 'YOUR_WEATHERAPI_KEY_HERE'; 

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const locationBtn = document.getElementById('location-btn');
const unitToggleBtn = document.getElementById('unit-toggle');
const dashboardContent = document.getElementById('dashboard-content');
const loadingState = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// UI Data Fields
const cityName = document.getElementById('city-name');
const localTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const degreeSym = document.querySelector('.degree-sym');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const uvIndex = document.getElementById('uv-index');
const visibility = document.getElementById('visibility');

// App State Configurations
let currentWeatherData = null;
let isMetric = true;

// Event Listeners
searchBtn.addEventListener('click', parseSearchIntent);
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') parseSearchIntent(); });
unitToggleBtn.addEventListener('click', toggleTemperatureUnit);
locationBtn.addEventListener('click', getUserLocation);

// Auto-fetch local weather when the user opens the page
window.addEventListener('DOMContentLoaded', getUserLocation);

function parseSearchIntent() {
    const targetQuery = cityInput.value.trim();
    if (targetQuery) fetchDashboardData(targetQuery);
}

async function fetchDashboardData(query) {
    dashboardContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        const response = await fetch(`https://weatherapi.com{API_KEY}&q=${query}&aqi=no`);
        if (!response.ok) throw new Error('Resource failure');

        currentWeatherData = await response.json();
        renderDashboard();
    } catch (err) {
        loadingState.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const query = `${position.coords.latitude},${position.coords.longitude}`;
                fetchDashboardData(query);
            },
            () => {
                // Default fallback city if they deny permission or it fails
                fetchDashboardData('London');
            }
        );
    } else {
        fetchDashboardData('London');
    }
}

function toggleTemperatureUnit() {
    isMetric = !isMetric;
    unitToggleBtn.textContent = isMetric ? '°C' : '°F';
    if (currentWeatherData) {
        renderDashboard();
    }
}

function renderDashboard() {
    loadingState.classList.add('hidden');
    dashboardContent.classList.remove('hidden');

    const data = currentWeatherData;

    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    localTime.textContent = `Local Time: ${data.location.localtime}`;
    weatherDesc.textContent = data.current.condition.text;
    weatherIcon.src = `https:${data.current.condition.icon}`;
    humidity.textContent = `${data.current.humidity}%`;
    uvIndex.textContent = data.current.uv;

    // Handle dynamic conversion adjustments on rendering
    if (isMetric) {
        temperature.textContent = Math.round(data.current.temp_c);
        degreeSym.textContent = '°C';
        wind.textContent = `${data.current.wind_kph} km/h`;
        visibility.textContent = `${data.current.visibility_km} km`;
    } else {
        temperature.textContent = Math.round(data.current.temp_f);
        degreeSym.textContent = '°F';
        wind.textContent = `${data.current.wind_mph} mph`;
        visibility.textContent = `${data.current.visibility_miles} miles`;
    }

    evaluateVisualTheming(data.current.condition.text.toLowerCase());
}

function evaluateVisualTheming(conditionStr) {
    let backgroundUrl = '';
    if (conditionStr.includes('sunny') || conditionStr.includes('clear')) {
        backgroundUrl = "url('https://unsplash.com')";
    } else if (conditionStr.includes('rain') || conditionStr.includes('drizzle') || conditionStr.includes('shower')) {
        backgroundUrl = "url('https://unsplash.com')";
    } else if (conditionStr.includes('snow') || conditionStr.includes('blizzard') || conditionStr.includes('ice')) {
        backgroundUrl = "url('https://unsplash.com')";
    } else if (conditionStr.includes('cloud') || conditionStr.includes('overcast') || conditionStr.includes('mist') || conditionStr.includes('fog')) {
        backgroundUrl = "url('https://unsplash.com')";
    } else {
        backgroundUrl = "url('https://unsplash.com')";
    }
    document.documentElement.style.setProperty('--bg-image', backgroundUrl);
}