import * as https from 'https';
import { WeatherData, NewsData, ApiConfig } from './types';

const config: ApiConfig = {
  weather: {
    baseUrl: 'https://home.openweathermap.org/',
    apiKey: '2ad67a790461570038f7afd6f3d7c325'
  },
  news: {
    baseUrl: 'https://newsdata.io/',
    apiKey: 'pub_0d40228218204c23804674f825c2f150'
  }
};

// Generic HTTPS GET request wrapped in a Promise
function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Fetch weather data using Promises
function fetchWeatherPromise(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl = `${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
  return httpsGet(weatherUrl).then((data) => JSON.parse(data));
}

// Fetch news data using Promises
function fetchNewsPromise(): Promise<NewsData> {
  const newsUrl = `${config.news.baseUrl}/api/1/news?apikey=${config.news.apiKey}&country=us`;
  return httpsGet(newsUrl).then((data) => JSON.parse(data));
}

// Sequentially fetching data with Promises
function sequentialPromises(): Promise<void> {
  console.log('=== SEQUENTIAL PROMISES ===');

  return fetchWeatherPromise(40.7128, -74.0060)
    .then((weather) => {
      console.log('Weather Data:');
      console.log(`  Location: ${weather.timezone}`);
      console.log(`  Temperature: ${weather.current.temp}°C`);
      console.log(`  Condition: ${weather.current.weather[0].description}`);
      return fetchNewsPromise();
    })
    .then((news) => {
      console.log('\nNews Data:');
      const newsResults = (news as any).results || [];
      console.log(`  Total Articles: ${newsResults.length}`);
      newsResults.slice(0, 3).forEach((article: any, index: number) => {
        console.log(`    ${index + 1}. ${article.title}`);
      });
      console.log('=== END SEQUENTIAL PROMISES ===\n');
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
}

// Parallel fetching using Promise.all
function parallelPromises(): Promise<void> {
  console.log('=== PARALLEL PROMISES ===');

  return Promise.all([
    fetchWeatherPromise(40.7128, -74.0060),
    fetchNewsPromise()
  ])
    .then(([weather, news]) => {
      console.log('Weather Data:');
      console.log(`  Location: ${weather.timezone}`);
      console.log(`  Temperature: ${weather.current.temp}°C`);
      console.log(`  Condition: ${weather.current.weather[0].description}`);

      console.log('\nNews Data:');
      const newsResults = (news as any).results || [];
      console.log(`  Total Articles: ${newsResults.length}`);
      newsResults.slice(0, 3).forEach((article: any, index: number) => {
        console.log(`    ${index + 1}. ${article.title}`);
      });

      console.log('=== END PARALLEL PROMISES ===\n');
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
}

if (require.main === module) {
  console.log('🚀 Starting Promise Version...\n');
  sequentialPromises().then(() => setTimeout(() => parallelPromises(), 1000));
}
