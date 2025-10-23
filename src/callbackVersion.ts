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

function httpsGet(url: string, callback: (error: Error | null, data?: string) => void): void {
  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        callback(null, data);
      } else {
        callback(new Error(`HTTP ${response.statusCode}: ${data}`));
      }
    });

  }).on('error', (error) => {
    callback(error);
  });
}

// Fetch weather data using callbacks
function fetchWeatherCallback(lat: number, lon: number, callback: (error: Error | null, weather?: WeatherData) => void): void {
  const weatherUrl = `https://${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
  
  httpsGet(weatherUrl, (error, data) => {
    if (error) {
      callback(error);
      return;
    }
    
    try {
      const weatherData: WeatherData = JSON.parse(data!);
      callback(null, weatherData);
    } catch (parseError) {
      callback(parseError as Error);
    }
  });
}

// Fetch news data using callbacks
function fetchNewsCallback(callback: (error: Error | null, news?: NewsData) => void): void {
  const newsUrl = `https://${config.news.baseUrl}/posts`;
  
  httpsGet(newsUrl, (error, data) => {
    if (error) {
      callback(error);
      return;
    }
    
    try {
      const newsData: NewsData = JSON.parse(data!);
      callback(null, newsData);
    } catch (parseError) {
      callback(parseError as Error);
    }
  });
}

function fetchDataWithCallbackHell(): void {
  console.log('=== CALLBACK HELL DEMONSTRATION ===');
  
  fetchWeatherCallback(40.7128, -74.0060, (weatherError, weather) => {
    if (weatherError) {
      console.error('Weather Error:', weatherError.message);
      return;
    }
    
    console.log('Weather data received');
    console.log(`  Location: ${weather!.timezone}`);
    console.log(`  Temperature: ${weather!.current.temp}°C`);
    console.log(`  Condition: ${weather!.current.weather[0].description}`);
    
    // Nested callback for news
    fetchNewsCallback((newsError, news) => {
      if (newsError) {
        console.error('News Error:', newsError.message);
        return;
      }
      
      console.log('✓ News data received');
      console.log(`  Total posts: ${news!.posts.length}`);
      console.log('  Latest headlines:');
      news!.posts.slice(0, 3).forEach((post, index) => {
        console.log(`    ${index + 1}. ${post.title}`);
      });
      
      console.log('\n✓ All data fetched successfully!');
      console.log('=== END CALLBACK HELL DEMONSTRATION ===\n');
    });
  });
}

function sequentialCallbacks(): void {
  console.log('=== SEQUENTIAL CALLBACKS ===');
  
  fetchWeatherCallback(40.7128, -74.0060, (weatherError, weather) => {
    if (weatherError) {
      console.error('Failed to fetch weather:', weatherError.message);
    } else {
      console.log('Weather:', weather!.current.temp + '°C');
    }
    
    fetchNewsCallback((newsError, news) => {
      if (newsError) {
        console.error('Failed to fetch news:', newsError.message);
      } else {
        console.log('News count:', news!.posts.length);
      }
      console.log('=== END SEQUENTIAL CALLBACKS ===\n');
    });
  });
}

if (require.main === module) {
  console.log('🚀 Starting Callback Version...\n');
  sequentialCallbacks();
  setTimeout(() => {
    fetchDataWithCallbackHell();
  }, 1000);
}