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
        baseUrl: 'api.openweathermap.org',
        apiKey: '77a60f51032479c8f4f5798b0d55b95b'
    },
    news: {
        baseUrl: 'dummyjson.com',
        apiKey: 'pub_0d40228218204c23804674f825c2f150'
    }
};
function httpsGet(url, callback) {
    https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            if (response.statusCode === 200) {
                callback(null, data);
            }
            else {
                callback(new Error(`HTTP ${response.statusCode}: ${data}`));
            }
        });
    }).on('error', (error) => {
        callback(error);
    });
}
// Fetch weather data using callbacks
function fetchWeatherCallback(lat, lon, callback) {
    const weatherUrl = `https://${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
    httpsGet(weatherUrl, (error, data) => {
        if (error) {
            callback(error);
            return;
        }
        try {
            const weatherData = JSON.parse(data);
            callback(null, weatherData);
        }
        catch (parseError) {
            callback(parseError);
        }
    });
}
// Fetch news data using callbacks
function fetchNewsCallback(callback) {
    const newsUrl = `https://${config.news.baseUrl}/posts`;
    httpsGet(newsUrl, (error, data) => {
        if (error) {
            callback(error);
            return;
        }
        try {
            const newsData = JSON.parse(data);
            callback(null, newsData);
        }
        catch (parseError) {
            callback(parseError);
        }
    });
}
function fetchDataWithCallbackHell() {
    console.log('=== CALLBACK HELL DEMONSTRATION ===');
    fetchWeatherCallback(40.7128, -74.0060, (weatherError, weather) => {
        if (weatherError) {
            console.error('Weather Error:', weatherError.message);
            return;
        }
        console.log('Weather data received');
        console.log(`  Location: ${weather.timezone}`);
        console.log(`  Temperature: ${weather.current.temp}°C`);
        console.log(`  Condition: ${weather.current.weather[0].description}`);
        // Nested callback for news
        fetchNewsCallback((newsError, news) => {
            if (newsError) {
                console.error('News Error:', newsError.message);
                return;
            }
            console.log('✓ News data received');
            console.log(`  Total posts: ${news.posts.length}`);
            console.log('  Latest headlines:');
            news.posts.slice(0, 3).forEach((post, index) => {
                console.log(`    ${index + 1}. ${post.title}`);
            });
            console.log('\n✓ All data fetched successfully!');
            console.log('=== END CALLBACK HELL DEMONSTRATION ===\n');
        });
    });
}
function sequentialCallbacks() {
    console.log('=== SEQUENTIAL CALLBACKS ===');
    fetchWeatherCallback(40.7128, -74.0060, (weatherError, weather) => {
        if (weatherError) {
            console.error('Failed to fetch weather:', weatherError.message);
        }
        else {
            console.log('Weather:', weather.current.temp + '°C');
        }
        fetchNewsCallback((newsError, news) => {
            if (newsError) {
                console.error('Failed to fetch news:', newsError.message);
            }
            else {
                console.log('News count:', news.posts.length);
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
