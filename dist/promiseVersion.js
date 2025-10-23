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
function fetchWeatherPromise(lat, lon) {
    const weatherUrl = `https://${config.weather.baseUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${config.weather.apiKey}&units=metric`;
    return httpsGetPromise(weatherUrl)
        .then(data => JSON.parse(data));
}
function fetchNewsPromise() {
    const newsUrl = `https://${config.news.baseUrl}/posts`;
    return httpsGetPromise(newsUrl)
        .then(data => JSON.parse(data));
}
// Chain Promises for sequential execution
function promiseChain() {
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
function promiseAllDemo() {
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
function promiseRaceDemo() {
    console.log('=== PROMISE.RACE() DEMO ===');
    const weatherPromise = fetchWeatherPromise(40.7128, -74.0060);
    const newsPromise = fetchNewsPromise();
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout after 3 seconds')), 3000);
    });
    Promise.race([weatherPromise, newsPromise, timeoutPromise])
        .then((firstResult) => {
        console.log('✓ Fastest response received!');
        if ('current' in firstResult) {
            console.log('  Weather data arrived first');
            console.log(`  Temperature: ${firstResult.current.temp}°C`);
        }
        else if ('posts' in firstResult) {
            console.log('  News data arrived first');
            console.log(`  Posts count: ${firstResult.posts.length}`);
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
