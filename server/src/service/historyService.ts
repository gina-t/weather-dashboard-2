import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// this folder contains service classes that encapsulate logic and data access
// this file specifically contains logic related to fetching or storing historical data

// Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  // Read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  // Write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  // GetCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return this.read();
  }

  // AddCity method that adds a city to the searchHistory.json file
  public async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const id = cities.length ? cities[cities.length - 1].id + 1 : 1;
    const newCity = new City(id, name);
    cities.push(newCity);
    await this.write(cities);
  }

  // BONUS: RemoveCity method that removes a city from the searchHistory.json file
  public async removeCity(id: number): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
