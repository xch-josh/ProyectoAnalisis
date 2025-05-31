import React, { createContext, useContext, useState, useEffect } from 'react';
import CartService from '../services/CartService';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar items del carrito desde la API al iniciar
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calcular subtotal y total cuando cambian los items del carrito o el descuento
  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal - discount);
  }, [cartItems, discount]);
  
  // Obtener items del carrito desde la API
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await CartService.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      toast.error('No se pudo cargar el carrito');
    } finally {
      setLoading(false);
    }
  };
  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      
      const cartItem = {
        productId: product.productId,
        quantity: quantity
      };
      
      await CartService.addCartItem(cartItem);
      await fetchCartItems(); // Recargar el carrito
      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('No se pudo agregar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (cartId) => {
    try {
      setLoading(true);
      await CartService.deleteCartItem(cartId);
      await fetchCartItems(); // Recargar el carrito
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      toast.error('No se pudo eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = async (cartId, quantity) => {
    try {
      setLoading(true);
      const item = cartItems.find(item => item.cartId === cartId);
      if (item) {
        const updatedItem = { ...item, quantity: quantity };
        await CartService.updateCartItem(updatedItem);
        await fetchCartItems(); // Recargar el carrito
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error('No se pudo actualizar la cantidad');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar descuento
  const applyDiscount = (amount) => {
    setDiscount(amount);
  };

  // Limpiar carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      await CartService.clearCart();
      setCartItems([]);
      setDiscount(0);
      toast.success('Carrito vaciado correctamente');
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      toast.error('No se pudo vaciar el carrito');
    } finally {
      setLoading(false);
    }
  };
  return (
    <CartContext.Provider value={{
      cartItems,
      total,
      subtotal,
      discount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyDiscount,
      clearCart,
      fetchCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};