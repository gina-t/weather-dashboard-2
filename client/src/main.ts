import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
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
  } catch (error) {
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
  } catch (error) {
    console.error('Error:', error);
    renderSearchHistory([]);
  }
};

const deleteCityFromHistory = async (id: string) => {
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
  } catch (error) {
    console.error('Error:', error);
  }
};

/*

Render Functions

*/

interface CurrentWeather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
}
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const renderCurrentWeather = (currentWeather: CurrentWeather): void => {
  const { city, date, icon, iconDescription, temperature, windSpeed, humidity } = currentWeather;

  const capitalizedCity = capitalizeFirstLetter(city);
  const windSpeedKPH = (windSpeed * 3.6).toFixed(2); // Convert m/s to KPH
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  heading.textContent = `${capitalizedCity} (${formattedDate})`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  tempEl.textContent = `Temp: ${temperature}°C`;
  windEl.textContent = `Wind: ${windSpeedKPH} km/h`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any[]): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  // Filter forecast to include only every fourth entry (12-hour increments)
  const filteredForecast = forecast.filter((_, index) => index % 8 === 0);

  for (let i = 0; i < filteredForecast.length; i++) {
    renderForecastCard(filteredForecast[i]);
  }
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, temperature, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  // Convert wind speed from MPH to KPH
  const windSpeedKPH = (windSpeed * 1.60934).toFixed(2);
  
  // Add content to elements
  cardTitle.textContent = date;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${temperature} °C`;
  windEl.textContent = `Wind: ${windSpeedKPH} KPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = (historyList: any[]) => {
  if (!Array.isArray(historyList)) {
    console.error('Invalid history list:', historyList);
    return;
  }

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      const noHistoryMessage = document.createElement('h6');
      noHistoryMessage.classList.add('no-history-message', 'text-center');
      noHistoryMessage.textContent = 'No Previous Search History';
      searchHistoryContainer.append(noHistoryMessage);
      return;
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
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
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

const createHistoryButton = (city: string) => {
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
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
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

const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  const errorMessageEl = document.getElementById('error-message');
  if (errorMessageEl) {
    errorMessageEl.remove();
  }

  if (!searchInput.value.trim()) {
    const errorMessage = document.createElement('p');
    errorMessage.id = 'error-message';
    errorMessage.textContent = 'City cannot be blank';
    errorMessage.style.color = 'red';
    searchForm.appendChild(errorMessage);
    return;
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
    searchInput.placeholder = search; // Update the placeholder with the searched city
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(() => {
      getAndRenderHistory();
      searchInput.placeholder = city; // Update the placeholder with the searched city
    });
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () => {
  fetchSearchHistory();
};

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
