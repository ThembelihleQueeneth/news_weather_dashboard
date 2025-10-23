export const config = {
  lat: "-26.2041",
  lon: "28.0473",

  weatherUrl(lat: string, lon: string) {
    return `https://home.openweathermap.org//v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  },

  newsUrl: "https://newsdata.io//posts?limit=5"
};
