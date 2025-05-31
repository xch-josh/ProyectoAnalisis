// Servicio para la conexión real con la API del backend para el módulo de Brands
import { API_CONFIG, getRequestConfig, handleApiResponse, transformBoolean, transformState } from './apiConfig';

export const BrandAPIService = {
    // Obtener todas las marcas
    getAll: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/Brand`, getRequestConfig());
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error al obtener marcas:', error);
            throw error;
        }
    },

    // Obtener una marca por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/Brand/${id}`, getRequestConfig());
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al obtener marca con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva marca
    create: async (brandData) => {
        try {
            // Transformar los datos del frontend al formato del backend
            // NO incluir BrandId porque es autoincremental en la BD
            const backendBrand = {
                Name: brandData.Name,
                State: transformBoolean(brandData.State)
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Brand`, 
                getRequestConfig('POST', backendBrand)
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error al crear marca:', error);
            throw error;
        }
    },

    // Actualizar una marca existente
    update: async (id, brandData) => {
        try {
            // Transformar los datos del frontend al formato del backend
            const backendBrand = {
                BrandId: id,
                Name: brandData.Name,
                State: transformBoolean(brandData.State)
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Brand`, 
                getRequestConfig('PUT', backendBrand)
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al actualizar marca con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una marca
    delete: async (id) => {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Brand/${id}`, 
                getRequestConfig('DELETE')
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al eliminar marca con ID ${id}:`, error);
            throw error;
        }
    },    // Función helper para transformar datos del backend al formato del frontend
    transformToFrontendFormat: (backendBrand) => {
        return {
            id: backendBrand.brandId,
            Brand_ID: `BRD-${String(backendBrand.brandId).padStart(3, '0')}`,
            name: backendBrand.name,
            state: transformState(backendBrand.state)
        };
    },

    // Función para obtener todas las marcas transformadas al formato del frontend
    getAllFormatted: async () => {
        try {
            const brands = await BrandAPIService.getAll();
            return brands.map(BrandAPIService.transformToFrontendFormat);
        } catch (error) {
            console.error('Error al obtener marcas formateadas:', error);
            throw error;
        }
    },

    // Función para obtener una marca por ID transformada al formato del frontend
    getByIdFormatted: async (id) => {
        try {
            const brand = await BrandAPIService.getById(id);
            return BrandAPIService.transformToFrontendFormat(brand);
        } catch (error) {
            console.error(`Error al obtener marca formateada con ID ${id}:`, error);
            throw error;
        }
    }
};

export default BrandAPIService; 