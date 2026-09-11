const API_KEY = 'YOUR_WEATHERAPI_KEY_HERE'; 

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const dashboardContent = document.getElementById('dashboard-content');
const loadingState = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const localTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const uvIndex = document.getElementById('uv-index');
const visibility = document.getElementById('visibility');

searchBtn.addEventListener('click', parseSearchIntent);
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') parseSearchIntent(); });

function parseSearchIntent() {
    const targetQuery = cityInput.value.trim();
    if (targetQuery) fetchDashboardData(targetQuery);
}

async function fetchDashboardData(city) {
    dashboardContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingState.classList.remove('hidden');

    try {
        const response = await fetch(`https://weatherapi.com{API_KEY}&q=${city}&aqi=no`);
        if (!response.ok) throw new Error('API Resource Failure');

        const metrics = await response.json();
        renderDashboard(metrics);
    } catch (err) {
        loadingState.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

function renderDashboard(data) {
    loadingState.classList.add('hidden');
    dashboardContent.classList.remove('hidden');
   
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    localTime.textContent = `Local Time: ${data.location.localtime}`;
    temperature.textContent = Math.round(data.current.temp_c);
    weatherDesc.textContent = data.current.condition.text;
    weatherIcon.src = `https:${data.current.condition.icon}`;
    
    humidity.textContent = `${data.current.humidity}%`;
    wind.textContent = `${data.current.wind_kph} km/h`;
    uvIndex.textContent = data.current.uv;
    visibility.textContent = `${data.current.visibility_km} km`;
    
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