const apiKey = "9aca2bc3fc886afc508c2adbb4570873";

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const resultDiv = document.getElementById('weatherResult');
    const city = cityInput.value.trim();

    if (!city) {
        resultDiv.innerHTML = `<p style="color: #ff5f56;">[!] Please specify a target city.</p>`;
        return;
    }

    resultDiv.innerHTML = `<p style="color: #38bdf8;">[>] Initializing telemetry scan for: ${city}...</p>`;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
        
        if (!response.ok) {
            throw new Error("Location not found or telemetry offline");
        }

        const data = await response.json();
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        resultDiv.innerHTML = `
            <div style="border-top: 1px solid rgba(56, 189, 248, 0.2); padding-top: 15px;">
                <h3 style="color: #38bdf8; margin-bottom: 5px;">${data.name}, ${data.sys.country}</h3>
                <img src="${iconUrl}" alt="Weather Icon" style="width: 80px; height: 80px;">
                <p style="color: #f3f4f6; font-size: 1.4rem; font-weight: bold; margin: 5px 0;">${Math.round(data.main.temp)}°C</p>
                <p style="color: #cbd5e1; text-transform: capitalize;">Condition: <span style="color: #34d399;">${data.weather[0].description}</span></p>
                <p style="color: #cbd5e1;">Humidity: <span style="color: #38bdf8;">${data.main.humidity}%</span></p>
                <p style="color: #cbd5e1;">Wind Speed: <span style="color: #38bdf8;">${data.wind.speed} m/s</span></p>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: #ff5f56;">[X] Telemetry Error: ${error.message}</p>`;
    }
}

// Allow pressing "Enter" key inside the city input field
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                getWeather();
            }
        });
    }
});