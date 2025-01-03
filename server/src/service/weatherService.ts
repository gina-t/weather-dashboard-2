import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Explicitly specify the path to the .env file

interface Coordinates {
  lat: number;
  lon: number;
}

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  city?: string;
}

class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  icon: string;

  constructor(temperature: number, humidity: number, description: string, windSpeed: number, icon: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}

class WeatherService {
  private geoBaseURL: string;
  private weatherBaseURL: string;
  private apiKey: string;

  constructor() {
    this.geoBaseURL = process.env.GEO_API_BASE_URL || '';
    this.weatherBaseURL = process.env.WEATHER_API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    console.log(`GEO_API_BASE_URL: ${this.geoBaseURL}`);
    console.log(`WEATHER_API_BASE_URL: ${this.weatherBaseURL}`);
    console.log(`API_KEY: ${this.apiKey}`);
  }

  private async fetchLocationData(query: string): Promise<any> {
    const url = new URL(`${this.geoBaseURL}/direct?q=${query}&appid=${this.apiKey}`);
    console.log(`Fetching location data from URL: ${url.toString()}`);
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`Error fetching location data: ${response.statusText}`);
      throw new Error('Network response failed');
    }
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  private buildGeocodeQuery(cityName: string): string {
    return `${cityName}`;
  }

  private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(cityName);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.weatherBaseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    console.log(`Fetching weather data from URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching weather data: ${response.statusText}`);
      throw new Error('Network response failed');
    }
    const weatherData = await response.json();
    console.log('Weather data:', weatherData);
    return weatherData;
  }

  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.main.humidity,
      response.weather[0].description,
      response.wind.speed,
      response.weather[0].icon // Include the icon property
    );
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]): WeatherData[] {
    const forecastArray = weatherData.map(data => {
      return {
        date: data.dt_txt,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      };
    });
    forecastArray.unshift({
      date: 'Current',
      temperature: currentWeather.temperature,
      humidity: currentWeather.humidity,
      description: currentWeather.description,
      windSpeed: currentWeather.windSpeed,
      icon: currentWeather.icon,
    });

    return forecastArray;
  }

  public async getWeatherForCity(cityName: string): Promise<WeatherData[]> {
    const coordinates = await this.fetchAndDestructureLocationData(cityName);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    
    // Include the city name in the current weather and forecast data
    forecastArray.forEach(data => data.city = cityName);
    return forecastArray;
  }
}

export default new WeatherService();
