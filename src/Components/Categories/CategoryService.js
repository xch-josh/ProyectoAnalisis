// Servicio para categorías que utiliza la conexión real con la API del backend
import CategoryAPIService from '../../API_Services/CategoryAPIService';

export const CategoryService = {
    // Obtener todas las categorías
    getAll: async () => {
        try {
            return await CategoryAPIService.getAllFormatted();
        } catch (error) {
            console.error('Error en CategoryService.getAll:', error);
            throw error;
        }
    },

    // Obtener una categoría por ID
    getById: async (id) => {
        try {
            return await CategoryAPIService.getByIdFormatted(id);
        } catch (error) {
            console.error(`Error en CategoryService.getById con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva categoría
    create: async (categoryData) => {
        try {
            // Transformar datos del formato del componente al formato esperado por la API
            const apiData = {
                Name: categoryData.name,
                State: categoryData.state || 'Activo'
            };
            
            return await CategoryAPIService.create(apiData);
        } catch (error) {
            console.error('Error en CategoryService.create:', error);
            throw error;
        }
    },

    // Actualizar una categoría existente
    update: async (id, categoryData) => {
        try {
            // Transformar datos del formato del componente al formato esperado por la API
            const apiData = {
                Name: categoryData.name,
                State: categoryData.state || 'Activo'
            };
            
            return await CategoryAPIService.update(id, apiData);
                } catch (error) {
            console.error(`Error en CategoryService.update con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una categoría
    delete: async (id) => {
        try {
            return await CategoryAPIService.delete(id);
        } catch (error) {
            console.error(`Error en CategoryService.delete con ID ${id}:`, error);
            throw error;
        }
    }
};

export default CategoryService;