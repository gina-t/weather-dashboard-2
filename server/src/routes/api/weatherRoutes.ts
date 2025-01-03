// this file defines the routes related to weather data

import { Router, Request, Response } from 'express';
const router = Router();

import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { cityName } = req.body;

  if (!cityName) {
    res.status(400).json({ error: 'City name is required' });
    return;
  }

  try {
    // GET weather data from city name
    const weatherData = await weatherService.getWeatherForCity(cityName);

    // Save city to search history
    await historyService.addCity(cityName);

    res.json(weatherData);
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET Request with city name to retrieve weather data
router.get('/weather', async (req: Request, res: Response): Promise<void> => {
  const { cityName } = req.query;

  if (!cityName || typeof cityName !== 'string') {
    res.status(400).json({ error: 'City name is required' });
    return;
  }

  try {
    // GET weather data from city name
    const weatherData = await weatherService.getWeatherForCity(cityName);

    res.json(weatherData);
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response): Promise<void> => {
  try {
    const cities = await historyService.getCities();
    res.json(cities);
  } catch (error: any) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await historyService.removeCity(parseInt(id, 10));
    res.status(204).send();
  } catch (error: any) {
    console.error('Error removing city from search history:', error);
    res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
