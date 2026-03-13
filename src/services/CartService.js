import ApiService from './ApiService';
import { API_ENDPOINTS } from './config';

const CartService = {
    // Obtener todos los elementos del carrito
    getCartItems: async () => {
        try {
            if(sessionStorage.getItem('userId') && sessionStorage.getItem('branchId')){
                return await ApiService.get(`${API_ENDPOINTS.CART}/${sessionStorage.getItem('userId')}/${sessionStorage.getItem('branchId')}`);
            }
            else
                return [];
        } catch (error) {
            console.error('Error al obtener elementos del carrito:', error);
            throw error;
        }
    },

    // Agregar un elemento al carrito
    addCartItem: async (cartItemData) => {
        try {
            return await ApiService.post(API_ENDPOINTS.CART, cartItemData);
        } catch (error) {
            console.error('Error al agregar elemento al carrito:', error);
            throw error;
        }
    },

    // Actualizar un elemento del carrito
    updateCartItem: async (cartItemData) => {
        try {
            return await ApiService.put(API_ENDPOINTS.CART, cartItemData);
        } catch (error) {
            console.error('Error al actualizar elemento del carrito:', error);
            throw error;
        }
    },

    // Eliminar un elemento del carrito
    deleteCartItem: async (id) => {
        try {
            return await ApiService.delete(`${API_ENDPOINTS.CART}/${id}`);
        } catch (error) {
            console.error(`Error al eliminar elemento del carrito con ID ${id}:`, error);
            throw error;
        }
    },

    // Vaciar carrito
    clearCart: async () => {
        try {
            return await ApiService.delete(`${API_ENDPOINTS.CART}/clear`);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw error;
        }
    }
};

export default CartService;
