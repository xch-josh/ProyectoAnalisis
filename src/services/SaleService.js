import ApiService from './ApiService';
import { API_ENDPOINTS } from './config';

const SaleService = {
    // Obtener todas las ventas
    getAllSales: async () => {
        try {
            return await ApiService.get(API_ENDPOINTS.SALES);
        } catch (error) {
            console.error('Error al obtener ventas:', error);
            throw error;
        }
    },

    // Obtener una venta por ID
    getSaleById: async (id) => {
        try {
            return await ApiService.get(`${API_ENDPOINTS.SALES}/${id}`);
        } catch (error) {
            console.error(`Error al obtener la venta con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva venta
    createSale: async (saleData) => {
        try {
            return await ApiService.post(API_ENDPOINTS.SALES, saleData);
        } catch (error) {
            console.error('Error al crear la venta:', error);
            throw error;
        }
    },

    // Obtener detalles de una venta específica
    getSaleDetails: async (saleId) => {
        try {
            return await ApiService.get(`${API_ENDPOINTS.SALE_DETAILS}?saleId=${saleId}`);
        } catch (error) {
            console.error(`Error al obtener los detalles de la venta ${saleId}:`, error);
            throw error;
        }
    }
};

export default SaleService;
