import axios from 'axios';
import API_BASE_URL from '../config/api';

// Shared axios instance for the client
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export default http;

