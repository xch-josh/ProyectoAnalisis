import ApiService from './ApiService';
import { API_ENDPOINTS } from './config';

const ClientService = {
    // Obtener todos los clientes
    getAllClients: async () => {
        try {
            return await ApiService.get(API_ENDPOINTS.CLIENTS);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    },

    // Obtener un cliente por ID
    getClientById: async (id) => {
        try {
            return await ApiService.get(`${API_ENDPOINTS.CLIENTS}/${id}`);
        } catch (error) {
            console.error(`Error al obtener el cliente con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo cliente
    createClient: async (clientData) => {
        try {
            return await ApiService.post(API_ENDPOINTS.CLIENTS, clientData);
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            throw error;
        }
    },

    // Actualizar un cliente existente
    updateClient: async (clientData) => {
        try {
            return await ApiService.put(API_ENDPOINTS.CLIENTS, clientData);
        } catch (error) {
            console.error(`Error al actualizar el cliente:`, error);
            throw error;
        }
    },

    // Eliminar un cliente
    deleteClient: async (id) => {
        try {
            return await ApiService.delete(`${API_ENDPOINTS.CLIENTS}/${id}`);
        } catch (error) {
            console.error(`Error al eliminar el cliente con ID ${id}:`, error);
            throw error;
        }
    }
};

export default ClientService;
