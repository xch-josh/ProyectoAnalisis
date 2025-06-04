import React, { useState, useEffect, useCallback } from 'react';
import BrandForm from './BrandForm';
import BrandService from './BrandService';

export default function BrandsMainView() {
    // Estado para almacenar las marcas
    const [brands, setBrands] = useState([]);
    // Estado para manejar la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para manejar el modal de marca (nueva/editar)
    const [showModal, setShowModal] = useState(false);
    // Estado para la marca actual (para edición)
    const [currentBrand, setCurrentBrand] = useState(null);
    // Estado para manejar carga de datos
    const [loading, setLoading] = useState(false);

    // Función para cargar las marcas desde el servicio
    const loadBrands = useCallback(async () => {
        setLoading(true);
        try {
            const data = await BrandService.getAll();
            setBrands(data);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            alert('No se pudieron cargar las marcas. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para filtrar marcas según el término de búsqueda
    const filteredBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para abrir el modal de creación de marca
    const handleNewBrand = () => {
        setCurrentBrand(null);
        setShowModal(true);
    };

    // Función para abrir el modal de edición de marca
    const handleEditBrand = (brand) => {
        setCurrentBrand(brand);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentBrand(null);
    };

    // Función para manejar el guardado de marca
    const handleSaveBrand = async (brandData) => {
        setLoading(true);
        try {
            if (brandData.id) {
                // Actualizar marca existente
                await BrandService.update(brandData.id, brandData);
            } else {
                // Crear nueva marca
                await BrandService.create(brandData);
            }
            handleCloseModal();
            loadBrands(); // Recargar la lista de marcas
        } catch (error) {
            console.error('Error al guardar la marca:', error);
            alert('No se pudo guardar la marca. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la eliminación de una marca
    const handleDeleteBrand = async (brandId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta marca?')) {
            setLoading(true);
            try {
                await BrandService.delete(brandId);
                loadBrands(); // Recargar la lista de marcas
            } catch (error) {
                console.error('Error al eliminar la marca:', error);
                alert('No se pudo eliminar la marca. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        }
    };    return (
        <div className='w-100 h-100'>
            <div className='w-100 h-100'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Marcas</h3>
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
                                    placeholder='Buscar por nombre' 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end col-md-8 mb-1'>
                            <button 
                                type='button' 
                                className='btn btn-primary btn-sm'
                                onClick={handleNewBrand}
                                disabled={loading}
                            >
                                <span className='mx-2'>
                                    <i className="bi bi-plus-lg"></i> Nueva Marca
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
                                        <th scope="col">ID</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBrands.length > 0 ? (
                                        filteredBrands.map(brand => (
                                            <tr key={brand.id}>
                                                <td>{brand.id}</td>
                                                <td>{brand.name}</td>
                                                <td>
                                                    <span className={`badge ${brand.state === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                        {brand.state}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-warning me-1"
                                                        onClick={() => handleEditBrand(brand)}
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteBrand(brand.id)}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">No se encontraron marcas</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar marca */}
            {showModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentBrand ? 'Editar Marca' : 'Nueva Marca'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <BrandForm 
                                    brand={currentBrand} 
                                    onSave={handleSaveBrand} 
                                    onCancel={handleCloseModal}
                                />
                            </div>                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}