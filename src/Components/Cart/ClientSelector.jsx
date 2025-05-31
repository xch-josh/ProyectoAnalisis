import React, { useState } from 'react';
import { useClientContext } from '../../context/ClientContext';
import ClientModal from '../Administration/Clients/ClientModal';

export default function ClientSelector({ onClose }) {
    const { clients, selectClient, selectedClient, addClient } = useClientContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);// Filtrar clientes basados en el término de búsqueda
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientId.toString().includes(searchTerm.toLowerCase()) ||
        (client.mail && client.mail.toLowerCase().includes(searchTerm.toLowerCase()))
    );    const handleSelectClient = (client) => {
        selectClient(client.clientId);
        onClose();
    };

    const handleOpenModal = () => {
        // Abrir el modal para crear un nuevo cliente
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleSaveClient = (clientData) => {
        // Usar la función del contexto para añadir el cliente
        const newClient = addClient(clientData);
          // Seleccionar automáticamente el cliente recién creado
        selectClient(newClient.clientId);
        
        // Cerrar el modal y el selector
        setShowModal(false);
        onClose();
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header bg-theme-primary text-white">
                        <h5 className="modal-title">Seleccionar Cliente</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            aria-label="Close" 
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">                        <div className="mb-3 d-flex justify-content-between">
                            <div className="input-group" style={{ width: "70%" }}>
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Buscar cliente por nombre, ID o correo..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button 
                                className="btn btn-success"
                                onClick={handleOpenModal}
                            >
                                <i className="bi bi-plus-lg"></i> Nuevo Cliente
                            </button>
                        </div>
                        
                        <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                            <table className="table table-hover">
                                <thead className="bg-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Correo</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center">No se encontraron clientes</td>
                                        </tr>
                                    ) : (                                        filteredClients.map(client => (
                                            <tr key={client.clientId} className={selectedClient?.clientId === client.clientId ? 'table-primary' : ''}>
                                                <td>{client.clientId}</td>
                                                <td>{client.name}</td>
                                                <td>{client.phone}</td>
                                                <td>{client.mail}</td>
                                                <td>
                                                    <span className={`badge ${client.state === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                        {client.state}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-primary" 
                                                        onClick={() => handleSelectClient(client)}
                                                    >
                                                        Seleccionar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Modal para crear un nuevo cliente */}
            {showModal && (
                <ClientModal 
                    show={showModal} 
                    handleClose={handleCloseModal} 
                    handleSave={handleSaveClient}
                    client={null}
                />
            )}
        </div>
    );
}
