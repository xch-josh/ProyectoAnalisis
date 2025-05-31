import axios from 'axios';
import { API_BASE_URL } from './config';

// Configuración del cliente Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);

// Funciones generales del servicio API
const ApiService = {
    // GET - Obtener datos
    get: async (url) => {
        try {
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // POST - Crear nuevos datos
    post: async (url, data) => {
        try {
            const response = await api.post(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // PUT - Actualizar datos existentes
    put: async (url, data) => {
        try {
            const response = await api.put(url, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // DELETE - Eliminar datos
    delete: async (url) => {
        try {
            const response = await api.delete(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default ApiService;
