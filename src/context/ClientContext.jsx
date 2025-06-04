import React, { createContext, useContext, useState, useEffect } from 'react';
import ClientService from '../services/ClientService';
import { toast } from 'react-toastify';

const ClientContext = createContext();

export const useClientContext = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Cargar clientes desde la API
  useEffect(() => {
    fetchClients();
  }, []);
  
  // Función para obtener los clientes desde la API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsData = await ClientService.getAllClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };
  // Seleccionar un cliente para usarlo en el carrito
  const selectClient = async (clientId) => {
    try {
      setLoading(true);
      const client = await ClientService.getClientById(clientId);
      setSelectedClient(client);
    } catch (error) {
      console.error('Error al seleccionar cliente:', error);
      toast.error('No se pudo seleccionar el cliente');
    } finally {
      setLoading(false);
    }
  };

  // Añadir un nuevo cliente
  const addClient = async (clientData) => {
    try {
      setLoading(true);
      const newClient = await ClientService.createClient(clientData);
      await fetchClients(); // Recargar la lista de clientes
      toast.success('Cliente agregado con éxito');
      return newClient;
    } catch (error) {
      console.error('Error al añadir cliente:', error);
      toast.error('No se pudo agregar el cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un cliente existente
  const updateClient = async (clientData) => {
    try {
      setLoading(true);
      await ClientService.updateClient(clientData);
      
      // Actualizar localmente el cliente seleccionado si es necesario
      if (selectedClient && selectedClient.clientId === clientData.clientId) {
        setSelectedClient(clientData);
      }
      
      await fetchClients(); // Recargar la lista de clientes
      toast.success('Cliente actualizado con éxito');
      return clientData;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      toast.error('No se pudo actualizar el cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un cliente
  const deleteClient = async (clientId) => {
    try {
      setLoading(true);
      await ClientService.deleteClient(clientId);
      
      // Si el cliente eliminado era el seleccionado, limpiamos la selección
      if (selectedClient && selectedClient.clientId === clientId) {
        setSelectedClient(null);
      }
      
      await fetchClients(); // Recargar la lista de clientes
      toast.success('Cliente eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      toast.error('No se pudo eliminar el cliente');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar el cliente seleccionado
  const clearSelectedClient = () => {
    setSelectedClient(null);
  };
  return (
    <ClientContext.Provider value={{
      clients,
      selectedClient,
      loading,
      selectClient,
      addClient,
      updateClient,
      deleteClient,
      clearSelectedClient,
      fetchClients
    }}>
      {children}
    </ClientContext.Provider>
  );
};
