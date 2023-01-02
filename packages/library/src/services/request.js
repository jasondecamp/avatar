/*
*   Wrapper for providing global defaults and abstracting the library for http
*   requests
*/
import axios from 'axios';

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Set request defaults
request.defaults.headers.common['Content-Type'] = 'application/json';

// Extend the request with axios cancelToken function
request.CancelToken = axios.CancelToken;
