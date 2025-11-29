import axios from 'axios';

// Siempre usa la API desplegada en Render
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Configurar axios con credenciales
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante para enviar cookies HTTPOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de autenticación
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Evitar bucle infinito: solo reintentar una vez
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        isRefreshing = false;
        return api.request(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
