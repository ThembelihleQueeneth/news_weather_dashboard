"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    lat: process.env.LAT || "-26.2041",
    lon: process.env.LON || "28.0473",
    weatherApiKey: process.env.OPENWEATHER_API_KEY || "",
    newsApiKey: process.env.NEWSDATA_API_KEY || "",
    weatherUrl(lat, lon) {
        return `/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${this.weatherApiKey}&units=metric`;
    },
    newsUrl() {
        return `/posts?apikey=${this.newsApiKey}`;
    }
};
