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

// Fetch weather data
async function fetchWeatherAsync(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl = `https://${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
  const data = await httpsGetPromise(weatherUrl);
  return JSON.parse(data) as WeatherData;
}

// Fetch news data
async function fetchNewsAsync(): Promise<NewsData> {
  const newsUrl = `https://${config.news.baseUrl}/posts`;
  const data = await httpsGetPromise(newsUrl);
  return JSON.parse(data) as NewsData;
}

// Sequential execution with async/await
async function sequentialAsyncAwait(): Promise<void> {
  console.log('=== SEQUENTIAL ASYNC/AWAIT ===');
  
  try {
    const weather = await fetchWeatherAsync(40.7128, -74.0060);
    console.log(' Weather data received');
    console.log(`  Temperature: ${weather.current.temp}°C`);
    console.log(`  Condition: ${weather.current.weather[0].description}`);
    
    const news = await fetchNewsAsync();
    console.log('  News data received');
    console.log(`  Total posts: ${news.posts.length}`);
    console.log('  Latest headlines:');
    news.posts.slice(0, 3).forEach((post, index) => {
      console.log(`    ${index + 1}. ${post.title}`);
    });
    
  } catch (error) {
    console.error('Error in sequential execution:', (error as Error).message);
  } finally {
    console.log('=== END SEQUENTIAL ASYNC/AWAIT ===\n');
  }
}

// Parallel execution with Promise.all and async/await
async function parallelAsyncAwait(): Promise<void> {
  console.log('=== PARALLEL ASYNC/AWAIT ===');
  
  try {
    const [weather, news] = await Promise.all([
      fetchWeatherAsync(40.7128, -74.0060),
      fetchNewsAsync()
    ]);
    
    console.log('✓ All data fetched in parallel!');
    console.log(`  Weather: ${weather.current.temp}°C`);
    console.log(`  News posts: ${news.posts.length}`);
    
  } catch (error) {
    console.error('Error in parallel execution:', (error as Error).message);
  } finally {
    console.log('=== END PARALLEL ASYNC/AWAIT ===\n');
  }
}

// Using Promise.race with async/await
async function raceAsyncAwait(): Promise<void> {
  console.log('=== PROMISE.RACE WITH ASYNC/AWAIT ===');
  
  try {
    const result = await Promise.race([
      fetchWeatherAsync(40.7128, -74.0060),
      fetchNewsAsync(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout after 2 seconds')), 2000);
      })
    ]);
    
    console.log('✓ Fastest response received!');
    if ('current' in (result as any)) {
      console.log('  Weather data arrived first');
    } else if ('posts' in (result as any)) {
      console.log('  News data arrived first');
    }
    
  } catch (error) {
    console.error('Error in race:', (error as Error).message);
  } finally {
    console.log('=== END PROMISE.RACE WITH ASYNC/AWAIT ===\n');
  }
}

// Error handling with try-catch
async function errorHandlingDemo(): Promise<void> {
  console.log('=== ERROR HANDLING DEMO ===');
  
  try {
    // Simulate an error by using invalid coordinates
    const weather = await fetchWeatherAsync(999, 999);
    console.log('This should not print');
  } catch (error) {
    console.log('✓ Error properly caught:');
    console.log(`  ${(error as Error).message}`);
  }
  
  console.log('=== END ERROR HANDLING DEMO ===\n');
}

async function main(): Promise<void> {
  console.log('🚀 Starting Async/Await Version...\n');
  
  await sequentialAsyncAwait();
  await parallelAsyncAwait();
  await raceAsyncAwait();
  await errorHandlingDemo();
}

if (require.main === module) {
  main().catch(console.error);
}