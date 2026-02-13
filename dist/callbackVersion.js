"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiClient_1 = require("./apiClient");
const logger_1 = require("./logger");
const config_1 = require("./config");
// Fetch weather data using callbacks
function fetchWeatherCallback(lat, lon, callback) {
    apiClient_1.weatherClient.get(config_1.config.weatherUrl(lat, lon))
        .then(response => callback(null, response.data))
        .catch(error => callback(error));
}
// Fetch news data using callbacks
function fetchNewsCallback(callback) {
    apiClient_1.newsClient.get(config_1.config.newsUrl())
        .then(response => callback(null, response.data))
        .catch(error => callback(error));
}
function fetchDataWithCallbackHell() {
    logger_1.logger.header('CALLBACK HELL DEMONSTRATION');
    fetchWeatherCallback(config_1.config.lat, config_1.config.lon, (weatherError, weather) => {
        if (weatherError) {
            logger_1.logger.error(`Weather Error: ${weatherError.message}`);
            return;
        }
        logger_1.logger.success('Weather data received');
        logger_1.logger.weather(`Location: ${weather.timezone}`);
        logger_1.logger.weather(`Temperature: ${weather.current.temp}°C`);
        logger_1.logger.weather(`Condition: ${weather.current.weather[0].description}`);
        // Nested callback for news
        fetchNewsCallback((newsError, news) => {
            if (newsError) {
                logger_1.logger.error(`News Error: ${newsError.message}`);
                return;
            }
            logger_1.logger.success('News data received');
            const articles = news.results || [];
            logger_1.logger.news(`Total Articles: ${articles.length}`);
            logger_1.logger.info('Latest headlines:');
            articles.slice(0, 3).forEach((article, index) => {
                logger_1.logger.news(`  ${index + 1}. ${article.title}`);
            });
            logger_1.logger.success('All data fetched successfully!');
            logger_1.logger.divider();
        });
    });
}
function sequentialCallbacks() {
    logger_1.logger.header('SEQUENTIAL CALLBACKS');
    fetchWeatherCallback(config_1.config.lat, config_1.config.lon, (weatherError, weather) => {
        if (weatherError) {
            logger_1.logger.error(`Failed to fetch weather: ${weatherError.message}`);
        }
        else {
            logger_1.logger.weather(`Weather: ${weather.current.temp}°C`);
        }
        fetchNewsCallback((newsError, news) => {
            if (newsError) {
                logger_1.logger.error(`Failed to fetch news: ${newsError.message}`);
            }
            else {
                const articles = news.results || [];
                logger_1.logger.news(`News count: ${articles.length}`);
            }
            logger_1.logger.divider();
        });
    });
}
if (require.main === module) {
    logger_1.logger.info('Starting Callback Version...');
    sequentialCallbacks();
    setTimeout(() => {
        fetchDataWithCallbackHell();
    }, 1000);
}
