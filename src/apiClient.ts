import axios from 'axios';

export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/3.0',
});

export const newsClient = axios.create({
  baseURL: 'https://newsdata.io/api/1',
});

// Response interceptor for better error handling could be added here
