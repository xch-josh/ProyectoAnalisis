import React, { useState } from 'react'
import ClientModal from './ClientModal';
import { useClientContext } from '../../../context/ClientContext';

export default function ClientsMainView() {
    const { clients, addClient, updateClient, deleteClient } = useClientContext();
    const [showModal, setShowModal] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');    // Filtrar clientes basados en el término de búsqueda
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.mail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (client = null) => {
        setCurrentClient(client);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentClient(null);
    };    const handleSaveClient = (clientData) => {
        if (clientData.clientId && clientData.clientId !== 0) {
            // Actualizar cliente existente
            updateClient(clientData);
        } else {
            // Crear nuevo cliente
            addClient(clientData);
        }
        handleCloseModal();
    };

    const handleDeleteClient = (id) => {
        if (window.confirm('¿Está seguro que desea eliminar este cliente?')) {
            deleteClient(id);
        }
    };

    return (
        <div className='w-100 h-100'>
            <div className='row'>
                <div className='mb-5'>
                    <h3 className='mb-0'>Clientes</h3>
                    <hr className='my-0' />
                </div>
                <div className='row mt-4 mb-2 col-sm-12 mx-auto'>
                    <div className='d-flex justify-content-start col-md-4'>
                        <div className='col-md-1 d-flex justify-content-center align-content-center'>
                            <i className="bi bi-search my-auto"></i>
                        </div>
                        <div className='col-md-9 px-0'>
                            <input 
                                type="text" 
                                className='form-control form-control-sm' 
                                placeholder='Buscar' 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='d-flex justify-content-end col-md-8 mb-1'>
                        <button 
                            type='button' 
                            className='btn btn-primary btn-sm'
                            onClick={() => handleOpenModal()}
                        >
                            <span className='mx-2'>
                                <i className="bi bi-plus-lg"></i> Nuevo Cliente
                            </span>
                        </button>
                    </div>
                </div>
                <div>
                    <table className="table table-hover">
                        <thead className="bg-theme-primary text-white">
                            <tr>
                                <th scope="col">Cliente ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Dirección</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Correo</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No se encontraron clientes</td>
                                </tr>
                            ) : (                                filteredClients.map(client => (
                                    <tr key={client.clientId}>
                                        <td>{client.clientId}</td>
                                        <td>{client.name}</td>
                                        <td>{client.direction}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.mail}</td><td>
                                            <span className={`badge ${client.state ? 'bg-success' : 'bg-danger'}`}>
                                                {client.state ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2" 
                                                onClick={() => handleOpenModal(client)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>                                            <button 
                                                className="btn btn-sm btn-outline-danger" 
                                                onClick={() => handleDeleteClient(client.clientId)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para crear/editar cliente */}
            <ClientModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleSave={handleSaveClient}
                client={currentClient}
            />
        </div>
    )
}
