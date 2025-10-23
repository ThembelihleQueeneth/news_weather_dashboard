import * as https from 'https';
import { WeatherData, NewsData, ApiConfig } from './types';

const config: ApiConfig = {
  weather: {
    baseUrl: 'api.openweathermap.org',
    apiKey: '77a60f51032479c8f4f5798b0d55b95b'

  },
  news: {
    baseUrl: 'dummyjson.com',
    apiKey: 'pub_0d40228218204c23804674f825c2f150'
  }
};

function httpsGetPromise(url: string): Promise<string> {
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

function fetchWeatherPromise(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl = `https://${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
  
  return httpsGetPromise(weatherUrl)
    .then(data => JSON.parse(data) as WeatherData);
}

function fetchNewsPromise(): Promise<NewsData> {
  const newsUrl = `https://${config.news.baseUrl}/posts`;
  
  return httpsGetPromise(newsUrl)
    .then(data => JSON.parse(data) as NewsData);
}

// Chain Promises for sequential execution
function promiseChain(): void {
  console.log('=== PROMISE CHAIN ===');
  
  fetchWeatherPromise(40.7128, -74.0060)
    .then(weather => {
      console.log('✓ Weather data received');
      console.log(`  Temperature: ${weather.current.temp}°C`);
      console.log(`  Condition: ${weather.current.weather[0].description}`);
      return fetchNewsPromise(); 
    })
    .then(news => {
      console.log('✓ News data received');
      console.log(`  Total posts: ${news.posts.length}`);
      console.log('  Latest headlines:');
      news.posts.slice(0, 3).forEach((post, index) => {
        console.log(`    ${index + 1}. ${post.title}`);
      });
    })
    .catch(error => {
      console.error('Error in promise chain:', error.message);
    })
    .finally(() => {
      console.log('=== END PROMISE CHAIN ===\n');
    });
}

function promiseAllDemo(): void {
  console.log('=== PROMISE.ALL() DEMO ===');
  
  const weatherPromise = fetchWeatherPromise(40.7128, -74.0060);
  const newsPromise = fetchNewsPromise();

  Promise.all([weatherPromise, newsPromise])
    .then(([weather, news]) => {
      console.log('✓ All data fetched simultaneously!');
      console.log(`  Weather: ${weather.current.temp}°C`);
      console.log(`  News posts: ${news.posts.length}`);
    })
    .catch(error => {
      console.error('Error with Promise.all:', error.message);
    })
    .finally(() => {
      console.log('=== END PROMISE.ALL() DEMO ===\n');
    });
}

function promiseRaceDemo(): void {
  console.log('=== PROMISE.RACE() DEMO ===');
  
  const weatherPromise = fetchWeatherPromise(40.7128, -74.0060);
  const newsPromise = fetchNewsPromise();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout after 3 seconds')), 3000);
  });

  Promise.race([weatherPromise, newsPromise, timeoutPromise])
    .then((firstResult) => {
      console.log('✓ Fastest response received!');
      if ('current' in (firstResult as any)) {
        console.log('  Weather data arrived first');
        console.log(`  Temperature: ${(firstResult as WeatherData).current.temp}°C`);
      } else if ('posts' in (firstResult as any)) {
        console.log('  News data arrived first');
        console.log(`  Posts count: ${(firstResult as NewsData).posts.length}`);
      }
    })
    .catch(error => {
      console.error('Error with Promise.race:', error.message);
    })
    .finally(() => {
      console.log('=== END PROMISE.RACE() DEMO ===\n');
    });
}

// Execute promise examples
if (require.main === module) {
  console.log('🚀 Starting Promise Version...\n');
  
  promiseChain();
  
  setTimeout(() => {
    promiseAllDemo();
  }, 1000);
  
  setTimeout(() => {
    promiseRaceDemo();
  }, 2000);
}