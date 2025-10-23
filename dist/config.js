"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    lat: "-26.2041",
    lon: "28.0473",
    weatherUrl(lat, lon) {
        return `https://home.openweathermap.org//v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    },
    newsUrl: "https://newsdata.io//posts?limit=5"
};
