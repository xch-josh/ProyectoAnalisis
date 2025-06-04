// Servicio para marcas que utiliza la conexión real con la API del backend
import BrandAPIService from '../../API_Services/BrandAPIService';

export const BrandService = {
    // Obtener todas las marcas
    getAll: async () => {
        try {
            return await BrandAPIService.getAllFormatted();
        } catch (error) {
            console.error('Error en BrandService.getAll:', error);
            throw error;
        }
    },

    // Obtener una marca por ID
    getById: async (id) => {
        try {
            return await BrandAPIService.getByIdFormatted(id);
        } catch (error) {
            console.error(`Error en BrandService.getById con ID ${id}:`, error);
            throw error;
        }
    },    // Crear una nueva marca
    create: async (brandData) => {
        try {
            // Transformar datos del formato del componente al formato esperado por la API
            const apiData = {
                Name: brandData.name,
                State: brandData.state || 'Activo'
            };
            
            return await BrandAPIService.create(apiData);
        } catch (error) {
            console.error('Error en BrandService.create:', error);
            throw error;
        }
    },

    // Actualizar una marca existente
    update: async (id, brandData) => {
        try {
            // Transformar datos del formato del componente al formato esperado por la API
            const apiData = {
                Name: brandData.name,
                State: brandData.state || 'Activo'
            };
            
            return await BrandAPIService.update(id, apiData);
        } catch (error) {
            console.error(`Error en BrandService.update con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una marca
    delete: async (id) => {
        try {
            return await BrandAPIService.delete(id);
        } catch (error) {
            console.error(`Error en BrandService.delete con ID ${id}:`, error);
            throw error;
        }
    }
};

export default BrandService;