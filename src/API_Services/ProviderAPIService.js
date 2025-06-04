// Servicio para la conexión real con la API del backend para el módulo de Providers
import { API_CONFIG, getRequestConfig, handleApiResponse, transformBoolean, transformState } from './apiConfig';

export const ProviderAPIService = {    // Obtener todos los proveedores
    getAll: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/Provider`, getRequestConfig());
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
            throw error;
        }
    },

    // Obtener un proveedor por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/Provider/${id}`, getRequestConfig());
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al obtener proveedor con ID ${id}:`, error);
            throw error;
        }
    },    // Crear un nuevo proveedor
    create: async (providerData) => {
        try {
            // Transformar los datos del frontend al formato del backend
            // NO incluir ProviderId porque es autoincremental en la BD
            const backendProvider = {
                Name: providerData.Name,
                Direction: providerData.Direction,
                Phone: providerData.Phone,
                Mail: providerData.Mail,
                State: transformBoolean(providerData.State)
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Provider`, 
                getRequestConfig('POST', backendProvider)
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error al crear proveedor:', error);
            throw error;
        }
    },    // Actualizar un proveedor existente
    update: async (id, providerData) => {
        try {
            // Transformar los datos del frontend al formato del backend
            const backendProvider = {
                ProviderId: id,
                Name: providerData.Name,
                Direction: providerData.Direction,
                Phone: providerData.Phone,
                Mail: providerData.Mail,
                State: transformBoolean(providerData.State)
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Provider`, 
                getRequestConfig('PUT', backendProvider)
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al actualizar proveedor con ID ${id}:`, error);
            throw error;
        }
    },    // Eliminar un proveedor
    delete: async (id) => {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Provider/${id}`, 
                getRequestConfig('DELETE')
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al eliminar proveedor con ID ${id}:`, error);
            throw error;
        }
    },    // Función helper para transformar datos del backend al formato del frontend
    transformToFrontendFormat: (backendProvider) => {
        return {
            id: backendProvider.providerId,
            Provider_ID: `PROV-${String(backendProvider.providerId).padStart(3, '0')}`,
            Name: backendProvider.name,
            Direction: backendProvider.direction,
            Phone: backendProvider.phone,
            Mail: backendProvider.mail,
            State: transformState(backendProvider.state)
        };
    },

    // Función para obtener todos los proveedores transformados al formato del frontend
    getAllFormatted: async () => {
        try {
            const providers = await ProviderAPIService.getAll();
            return providers.map(ProviderAPIService.transformToFrontendFormat);
        } catch (error) {
            console.error('Error al obtener proveedores formateados:', error);
            throw error;
        }
    },

    // Función para obtener un proveedor por ID transformado al formato del frontend
    getByIdFormatted: async (id) => {
        try {
            const provider = await ProviderAPIService.getById(id);
            return ProviderAPIService.transformToFrontendFormat(provider);
        } catch (error) {
            console.error(`Error al obtener proveedor formateado con ID ${id}:`, error);
            throw error;
        }
    }
};

export default ProviderAPIService;
