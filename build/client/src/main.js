import './styles/jass.css';
// * All necessary DOM elements selected
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const todayContainer = document.querySelector('#today');
const forecastContainer = document.querySelector('#forecast');
const searchHistoryContainer = document.getElementById('history');
const heading = document.getElementById('search-title');
const weatherIcon = document.getElementById('weather-img');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
/*

API Calls

*/
const fetchWeather = async (cityName) => {
    try {
        const response = await fetch('/api/weather/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cityName }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        console.log('weatherData: ', weatherData);
        renderCurrentWeather(weatherData[0]);
        renderForecast(weatherData.slice(1));
    }
    catch (error) {
        console.error('Error:', error);
    }
};
const fetchSearchHistory = async () => {
    try {
        const response = await fetch('/api/weather/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch search history');
        }
        const searchHistory = await response.json();
        console.log('searchHistory: ', searchHistory);
        renderSearchHistory(searchHistory);
    }
    catch (error) {
        console.error('Error:', error);
    }
};
const deleteCityFromHistory = async (id) => {
    try {
        const response = await fetch(`/api/weather/history/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete city from search history');
        }
        console.log(`City with id ${id} deleted from search history`);
        fetchSearchHistory(); // Refresh the search history
    }
    catch (error) {
        console.error('Error:', error);
    }
};
/*

Render Functions

*/
const renderCurrentWeather = (currentWeather) => {
    const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;
    // convert the following to typescript
    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    if (todayContainer) {
        todayContainer.innerHTML = '';
        todayContainer.append(heading, tempEl, windEl, humidityEl);
    }
};
const renderForecast = (forecast) => {
    const headingCol = document.createElement('div');
    const heading = document.createElement('h4');
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);
    if (forecastContainer) {
        forecastContainer.innerHTML = '';
        forecastContainer.append(headingCol);
    }
    for (let i = 0; i < forecast.length; i++) {
        renderForecastCard(forecast[i]);
    }
};
const renderForecastCard = (forecast) => {
    const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;
    const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();
    // Add content to elements
    cardTitle.textContent = date;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    if (forecastContainer) {
        forecastContainer.append(col);
    }
};
const renderSearchHistory = async (searchHistory) => {
    const historyList = await searchHistory.json();
    if (searchHistoryContainer) {
        searchHistoryContainer.innerHTML = '';
        if (!historyList.length) {
            searchHistoryContainer.innerHTML =
                '<p class="text-center">No Previous Search History</p>';
        }
        // * Start at end of history array and count down to show the most recent cities at the top.
        for (let i = historyList.length - 1; i >= 0; i--) {
            const historyItem = buildHistoryListItem(historyList[i]);
            searchHistoryContainer.append(historyItem);
        }
    }
};
/*

Helper Functions

*/
const createForecastCard = () => {
    const col = document.createElement('div');
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const cardTitle = document.createElement('h5');
    const weatherIcon = document.createElement('img');
    const tempEl = document.createElement('p');
    const windEl = document.createElement('p');
    const humidityEl = document.createElement('p');
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
    col.classList.add('col-auto');
    card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
    cardBody.classList.add('card-body', 'p-2');
    cardTitle.classList.add('card-title');
    tempEl.classList.add('card-text');
    windEl.classList.add('card-text');
    humidityEl.classList.add('card-text');
    return {
        col,
        cardTitle,
        weatherIcon,
        tempEl,
        windEl,
        humidityEl,
    };
};
const createHistoryButton = (city) => {
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
    btn.textContent = city;
    return btn;
};
const createDeleteButton = () => {
    const delBtnEl = document.createElement('button');
    delBtnEl.setAttribute('type', 'button');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'delete-city', 'btn', 'btn-danger', 'col-2');
    delBtnEl.addEventListener('click', handleDeleteHistoryClick);
    return delBtnEl;
};
const createHistoryDiv = () => {
    const div = document.createElement('div');
    div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
    return div;
};
const buildHistoryListItem = (city) => {
    const newBtn = createHistoryButton(city.name);
    const deleteBtn = createDeleteButton();
    deleteBtn.dataset.city = JSON.stringify(city);
    const historyDiv = createHistoryDiv();
    historyDiv.append(newBtn, deleteBtn);
    return historyDiv;
};
/*

Event Handlers

*/
const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    if (!searchInput.value) {
        throw new Error('City cannot be blank');
    }
    const search = searchInput.value.trim();
    fetchWeather(search).then(() => {
        getAndRenderHistory();
    });
    searchInput.value = '';
};
const handleSearchHistoryClick = (event) => {
    if (event.target.matches('.history-btn')) {
        const city = event.target.textContent;
        fetchWeather(city).then(getAndRenderHistory);
    }
};
const handleDeleteHistoryClick = (event) => {
    event.stopPropagation();
    const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
    deleteCityFromHistory(cityID).then(getAndRenderHistory);
};
/*

Initial Render

*/
const getAndRenderHistory = () => fetchSearchHistory().then(renderSearchHistory);
searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);
getAndRenderHistory();
