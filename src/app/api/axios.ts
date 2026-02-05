import axios from 'axios';
import { env } from '../config/env';
import { STORAGE_KEYS } from '../constants/localStorage';

export const api = axios.create({
  baseURL: `${env.API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
