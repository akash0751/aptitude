import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: api,
  withCredentials: true, // allows sending cookies like refreshToken
});

// ✅ Add access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ⬅️ Add token here
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Proactive token refresh every 1 minute
setInterval(async () => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('token_expiry');

  if (token && expiry) {
    const now = Date.now();

    // If token is about to expire in 2 minutes
    if (now > Number(expiry) - 2 * 60 * 1000) {
      try {
        const response = await axios.post(`${api}/clideal/refresh-token`, {}, {
          withCredentials: true,
        });

        const newToken = response.data.token;

        // ✅ Save new token and expiry
        localStorage.setItem('token', newToken);
        const decoded = jwtDecode(newToken);
        localStorage.setItem('token_expiry', decoded.exp * 1000);
      } catch (error) {
        console.error('Token refresh failed:', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login';
      }
    }
  }
}, 60 * 1000); // ⏱ Check every 60 seconds

// ✅ Axios response interceptor (in case token expires in between requests)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If access token expired (403) and retry not already done
    if (
      err.response?.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${api}/clideal/refresh-token`, {}, {
          withCredentials: true,
        });

        const newToken = response.data.token;

        // ✅ Save new token and expiry
        localStorage.setItem('token', newToken);
        const decoded = jwtDecode(newToken);
        localStorage.setItem('token_expiry', decoded.exp * 1000);

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch{
        // 🚨 Refresh failed — log out user
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
