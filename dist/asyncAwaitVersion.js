"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
const config = {
    weather: {
        baseUrl: 'https://home.openweathermap.org/',
        apiKey: '2ad67a790461570038f7afd6f3d7c325'
    },
    news: {
        baseUrl: 'https://newsdata.io/',
        apiKey: 'pub_0d40228218204c23804674f825c2f150'
    }
};
function httpsGetPromise(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                if (response.statusCode === 200) {
                    resolve(data);
                }
                else {
                    reject(new Error(`HTTP ${response.statusCode}: ${data}`));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}
// Fetch weather data
async function fetchWeatherAsync(lat, lon) {
    const weatherUrl = `https://${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
    const data = await httpsGetPromise(weatherUrl);
    return JSON.parse(data);
}
// Fetch news data
async function fetchNewsAsync() {
    const newsUrl = `https://${config.news.baseUrl}/posts`;
    const data = await httpsGetPromise(newsUrl);
    return JSON.parse(data);
}
// Sequential execution with async/await
async function sequentialAsyncAwait() {
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
    }
    catch (error) {
        console.error('Error in sequential execution:', error.message);
    }
    finally {
        console.log('=== END SEQUENTIAL ASYNC/AWAIT ===\n');
    }
}
// Parallel execution with Promise.all and async/await
async function parallelAsyncAwait() {
    console.log('=== PARALLEL ASYNC/AWAIT ===');
    try {
        const [weather, news] = await Promise.all([
            fetchWeatherAsync(40.7128, -74.0060),
            fetchNewsAsync()
        ]);
        console.log('✓ All data fetched in parallel!');
        console.log(`  Weather: ${weather.current.temp}°C`);
        console.log(`  News posts: ${news.posts.length}`);
    }
    catch (error) {
        console.error('Error in parallel execution:', error.message);
    }
    finally {
        console.log('=== END PARALLEL ASYNC/AWAIT ===\n');
    }
}
// Using Promise.race with async/await
async function raceAsyncAwait() {
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
        if ('current' in result) {
            console.log('  Weather data arrived first');
        }
        else if ('posts' in result) {
            console.log('  News data arrived first');
        }
    }
    catch (error) {
        console.error('Error in race:', error.message);
    }
    finally {
        console.log('=== END PROMISE.RACE WITH ASYNC/AWAIT ===\n');
    }
}
// Error handling with try-catch
async function errorHandlingDemo() {
    console.log('=== ERROR HANDLING DEMO ===');
    try {
        // Simulate an error by using invalid coordinates
        const weather = await fetchWeatherAsync(999, 999);
        console.log('This should not print');
    }
    catch (error) {
        console.log('✓ Error properly caught:');
        console.log(`  ${error.message}`);
    }
    console.log('=== END ERROR HANDLING DEMO ===\n');
}
async function main() {
    console.log('🚀 Starting Async/Await Version...\n');
    await sequentialAsyncAwait();
    await parallelAsyncAwait();
    await raceAsyncAwait();
    await errorHandlingDemo();
}
if (require.main === module) {
    main().catch(console.error);
}
