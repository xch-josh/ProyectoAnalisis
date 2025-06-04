import React, { useState, useEffect, useCallback } from 'react';
import ProviderForm from './ProviderForm';
import ProviderAPIService from '../../API_Services/ProviderAPIService';

export default function ProvidersMainView() {
    // Estado para almacenar los proveedores
    const [providers, setProviders] = useState([]);
    // Estado para manejar la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para manejar el modal de proveedor (nuevo/editar)
    const [showModal, setShowModal] = useState(false);
    // Estado para el proveedor actual (para edición)
    const [currentProvider, setCurrentProvider] = useState(null);
    // Estado para manejar carga de datos
    const [loading, setLoading] = useState(false);    // Función para cargar los proveedores desde el servicio
    const loadProviders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ProviderAPIService.getAllFormatted();
            setProviders(data);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
            alert('No se pudieron cargar los proveedores. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        loadProviders();
    }, [loadProviders]);

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para filtrar proveedores según el término de búsqueda
    const filteredProviders = providers.filter(provider => 
        provider.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.Provider_ID.includes(searchTerm) ||
        provider.Mail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para abrir el modal de creación de proveedor
    const handleNewProvider = () => {
        setCurrentProvider(null);
        setShowModal(true);
    };

    // Función para abrir el modal de edición de proveedor
    const handleEditProvider = (provider) => {
        setCurrentProvider(provider);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProvider(null);
    };    // Función para manejar el guardado de proveedor
    const handleSaveProvider = async (providerData) => {
        setLoading(true);
        try {
            if (providerData.id) {
                // Actualizar proveedor existente
                await ProviderAPIService.update(providerData.id, providerData);
            } else {
                // Crear nuevo proveedor
                await ProviderAPIService.create(providerData);
            }
            handleCloseModal();
            loadProviders(); // Recargar la lista de proveedores
        } catch (error) {
            console.error('Error al guardar el proveedor:', error);
            alert('No se pudo guardar el proveedor. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };    // Función para manejar la eliminación de un proveedor
    const handleDeleteProvider = async (providerId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este proveedor?')) {
            setLoading(true);
            try {
                await ProviderAPIService.delete(providerId);
                loadProviders(); // Recargar la lista de proveedores
            } catch (error) {
                console.error('Error al eliminar el proveedor:', error);
                alert('No se pudo eliminar el proveedor. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        }
    };    return (
        <div className='w-100 h-100'>
            <div className='w-100 h-100'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Proveedores</h3>
                        <hr className='my-0' />
                    </div>
                    <div className='row mt-4 mb-2 col-sm-12 mx-auto'>
                        <div className='d-flex justify-content-start col-md-4'>
                            <div className='col-md-1 d-flex justify-content-center align-content-center'>
                                <i className="bi bi-search my-auto"></i>
                            </div>
                            <div className='col-md-9 px-0'>                                <input 
                                    type="text" 
                                    id="txtSearch"
                                    autoComplete="off"
                                    className='form-control form-control-sm' 
                                    placeholder='Buscar por nombre, código o email' 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end col-md-8 mb-1'>
                            <button 
                                type='button' 
                                className='btn btn-primary btn-sm'
                                onClick={handleNewProvider}
                                disabled={loading}
                            >
                                <span className='mx-2'>
                                    <i className="bi bi-plus-lg"></i> Nuevo Proveedor
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="text-center my-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando datos...</p>
                        </div>
                    ) : (
                        <div>
                            <table className="table table-hover">
                                <thead className="bg-theme-primary text-white">
                                    <tr>
                                        <th scope="col">Código</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Dirección</th>
                                        <th scope="col">Teléfono</th>
                                        <th scope="col">Correo</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProviders.length > 0 ? (
                                        filteredProviders.map(provider => (
                                            <tr key={provider.id}>
                                                <td>{provider.Provider_ID}</td>
                                                <td>{provider.Name}</td>
                                                <td>{provider.Direction}</td>
                                                <td>{provider.Phone}</td>
                                                <td>{provider.Mail}</td>
                                                <td>
                                                    <span className={`badge ${provider.State === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                        {provider.State}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-warning me-1"
                                                        onClick={() => handleEditProvider(provider)}
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteProvider(provider.id)}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No se encontraron proveedores</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar proveedor */}
            {showModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <ProviderForm 
                                    provider={currentProvider} 
                                    onSave={handleSaveProvider} 
                                    onCancel={handleCloseModal}
                                />
                            </div>                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}