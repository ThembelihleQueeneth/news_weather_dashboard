import { WeatherData, NewsData } from './types';
import { weatherClient, newsClient } from './apiClient';
import { logger } from './logger';
import { config } from './config';

// Fetch weather data using callbacks
function fetchWeatherCallback(lat: string, lon: string, callback: (error: Error | null, weather?: WeatherData) => void): void {
  weatherClient.get(config.weatherUrl(lat, lon))
    .then(response => callback(null, response.data))
    .catch(error => callback(error));
}

// Fetch news data using callbacks
function fetchNewsCallback(callback: (error: Error | null, news?: NewsData) => void): void {
  newsClient.get(config.newsUrl())
    .then(response => callback(null, response.data))
    .catch(error => callback(error));
}

function fetchDataWithCallbackHell(): void {
  logger.header('CALLBACK HELL DEMONSTRATION');
  
  fetchWeatherCallback(config.lat, config.lon, (weatherError, weather) => {
    if (weatherError) {
      logger.error(`Weather Error: ${weatherError.message}`);
      return;
    }
    
    logger.success('Weather data received');
    logger.weather(`Location: ${weather!.timezone}`);
    logger.weather(`Temperature: ${weather!.current.temp}°C`);
    logger.weather(`Condition: ${weather!.current.weather[0].description}`);
    
    // Nested callback for news
    fetchNewsCallback((newsError, news) => {
      if (newsError) {
        logger.error(`News Error: ${newsError.message}`);
        return;
      }
      
      logger.success('News data received');
      const articles = (news as any).results || [];
      logger.news(`Total Articles: ${articles.length}`);
      logger.info('Latest headlines:');
      articles.slice(0, 3).forEach((article: any, index: number) => {
        logger.news(`  ${index + 1}. ${article.title}`);
      });
      
      logger.success('All data fetched successfully!');
      logger.divider();
    });
  });
}

function sequentialCallbacks(): void {
  logger.header('SEQUENTIAL CALLBACKS');
  
  fetchWeatherCallback(config.lat, config.lon, (weatherError, weather) => {
    if (weatherError) {
      logger.error(`Failed to fetch weather: ${weatherError.message}`);
    } else {
      logger.weather(`Weather: ${weather!.current.temp}°C`);
    }
    
    fetchNewsCallback((newsError, news) => {
      if (newsError) {
        logger.error(`Failed to fetch news: ${newsError.message}`);
      } else {
        const articles = (news as any).results || [];
        logger.news(`News count: ${articles.length}`);
      }
      logger.divider();
    });
  });
}

if (require.main === module) {
  logger.info('Starting Callback Version...');
  sequentialCallbacks();
  setTimeout(() => {
    fetchDataWithCallbackHell();
  }, 1000);
}