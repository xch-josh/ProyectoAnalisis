// Servicio para la conexión real con la API del backend para el módulo de Categories
import { API_CONFIG, getRequestConfig, handleApiResponse, transformBoolean, transformState } from './apiConfig';

export const CategoryAPIService = {
    // Obtener todas las categorías
    getAll: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/Category`, getRequestConfig());
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    },

    // Obtener una categoría por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/Category/${id}`, getRequestConfig());
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al obtener categoría con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva categoría
    create: async (categoryData) => {
        try {
            // Transformar los datos del frontend al formato del backend
            // NO incluir CategoryId porque es autoincremental en la BD
            const backendCategory = {
                Name: categoryData.Name,
                State: transformBoolean(categoryData.State)
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Category`, 
                getRequestConfig('POST', backendCategory)
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error('Error al crear categoría:', error);
            throw error;
        }
    },

    // Actualizar una categoría existente
    update: async (id, categoryData) => {
        try {
            // Transformar los datos del frontend al formato del backend
            const backendCategory = {
                CategoryId: id,
                Name: categoryData.Name,
                State: transformBoolean(categoryData.State)
            };

            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Category`, 
                getRequestConfig('PUT', backendCategory)
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al actualizar categoría con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una categoría
    delete: async (id) => {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/Category/${id}`, 
                getRequestConfig('DELETE')
            );
            
            return await handleApiResponse(response);
        } catch (error) {
            console.error(`Error al eliminar categoría con ID ${id}:`, error);
            throw error;
        }
    },

    // Función helper para transformar datos del backend al formato del frontend
    transformToFrontendFormat: (backendCategory) => {
        return {
            id: backendCategory.categoryId,
            Category_ID: `CAT-${String(backendCategory.categoryId).padStart(3, '0')}`,
            name: backendCategory.name,
            state: transformState(backendCategory.state)
        };
    },

    // Función para obtener todas las categorías transformadas al formato del frontend
    getAllFormatted: async () => {
        try {
            const categories = await CategoryAPIService.getAll();
            return categories.map(CategoryAPIService.transformToFrontendFormat);
        } catch (error) {
            console.error('Error al obtener categorías formateadas:', error);
            throw error;
        }
    },

    // Función para obtener una categoría por ID transformada al formato del frontend
    getByIdFormatted: async (id) => {
        try {
            const category = await CategoryAPIService.getById(id);
            return CategoryAPIService.transformToFrontendFormat(category);
        } catch (error) {
            console.error(`Error al obtener categoría formateada con ID ${id}:`, error);
            throw error;
        }
    }
};

export default CategoryAPIService;