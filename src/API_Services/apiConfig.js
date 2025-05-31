// Configuración general para los servicios de API
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5074',
    HEADERS: {
        'Content-Type': 'application/json',
    },
    TIMEOUT: 10000, // 10 segundos
};

// Configuración común para las peticiones fetch
export const getRequestConfig = (method = 'GET', body = null) => {
    const config = {
        method,
        headers: API_CONFIG.HEADERS,
    };
    
    if (body) {
        config.body = JSON.stringify(body);
    }
    
    return config;
};

// Manejo de errores de la API
export const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    // Si la respuesta está vacía, retornar null
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

// Funciones helper para transformaciones comunes
export const transformBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value.toLowerCase() === 'activo' || value.toLowerCase() === 'true';
    }
    return false;
};

export const transformState = (booleanValue) => {
    return booleanValue ? 'Activo' : 'Inactivo';
};

export default API_CONFIG;
