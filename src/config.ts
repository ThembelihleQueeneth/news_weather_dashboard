import dotenv from 'dotenv';
dotenv.config();

export const config = {
  lat: process.env.LAT || "-26.2041",
  lon: process.env.LON || "28.0473",
  weatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  newsApiKey: process.env.NEWSDATA_API_KEY || "",

  weatherUrl(lat: string, lon: string) {
    return `/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${this.weatherApiKey}&units=metric`;
  },

  newsUrl() {
    return `/posts?apikey=${this.newsApiKey}`;
  }
};
