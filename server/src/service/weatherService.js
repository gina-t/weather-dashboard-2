import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config({ path: '../../.env' }); // Explicitly specify the path to the .env file
class Weather {
    constructor(temperature, humidity, description, windSpeed) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.description = description;
        this.windSpeed = windSpeed;
    }
}
class WeatherService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
        console.log(`API_BASE_URL: ${this.baseURL}`);
        console.log(`API_KEY: ${this.apiKey}`);
    }
    async fetchLocationData(query) {
        const url = new URL(`${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`);
        console.log(`Fetching location data from URL: ${url.toString()}`);
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error(`Error fetching location data: ${response.statusText}`);
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
    destructureLocationData(locationData) {
        return {
            lat: locationData[0].lat,
            lon: locationData[0].lon,
        };
    }
    buildGeocodeQuery(cityName) {
        return `${cityName}`;
    }
    async fetchAndDestructureLocationData(cityName) {
        const query = this.buildGeocodeQuery(cityName);
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        console.log(`Fetching weather data from URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching weather data: ${response.statusText}`);
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();
        console.log('Weather data:', weatherData);
        return weatherData;
    }
    // TODO: Build parseCurrentWeather method
    // private parseCurrentWeather(response: any) {}
    parseCurrentWeather(response) {
        // Parse the weather data as needed
        return new Weather(response.main.temp, response.main.humidity, response.weather[0].description, response.wind.speed);
    }
    // TODO: Complete buildForecastArray method
    // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
    buildForecastArray(currentWeather, weatherData) {
        // Example implementation to build the forecast array
        const forecastArray = weatherData.map(data => {
            return {
                date: data.date,
                temperature: data.temperature,
                humidity: data.humidity,
                description: data.description,
                windSpeed: data.windSpeed,
            };
        });
        forecastArray.unshift({
            date: 'Current',
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity,
            description: currentWeather.description,
            windSpeed: currentWeather.windSpeed,
        });
        return forecastArray;
    }
    async getWeatherForCity(cityName) {
        const coordinates = await this.fetchAndDestructureLocationData(cityName);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
        return this.buildForecastArray(currentWeather, weatherData.list);
    }
}
export default new WeatherService();
