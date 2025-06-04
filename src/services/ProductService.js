import ApiService from './ApiService';
import { API_ENDPOINTS } from './config';

const ProductService = {
    // Obtener todos los productos
    getAllProducts: async () => {
        try {
            return await ApiService.get(API_ENDPOINTS.PRODUCTS);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    },

    // Obtener un producto por ID
    getProductById: async (id) => {
        try {
            return await ApiService.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
        } catch (error) {
            console.error(`Error al obtener el producto con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo producto
    createProduct: async (productData) => {
        try {
            return await ApiService.post(API_ENDPOINTS.PRODUCTS, productData);
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw error;
        }
    },

    // Actualizar un producto existente
    updateProduct: async (productData) => {
        try {
            return await ApiService.put(API_ENDPOINTS.PRODUCTS, productData);
        } catch (error) {
            console.error(`Error al actualizar el producto:`, error);
            throw error;
        }
    },

    // Eliminar un producto
    deleteProduct: async (id) => {
        try {
            return await ApiService.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
        } catch (error) {
            console.error(`Error al eliminar el producto con ID ${id}:`, error);
            throw error;
        }
    }
};

export default ProductService;
