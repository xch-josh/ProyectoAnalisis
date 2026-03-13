import React, { useState, useEffect, useCallback } from 'react';
import CategoryForm from './CategoryForm';
import CategoryService from './CategoryService';

export default function CategoriesMainView() {
    // Estado para almacenar las categorías
    const [categories, setCategories] = useState([]);
    // Estado para manejar la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para manejar el modal de categoría (nueva/editar)
    const [showModal, setShowModal] = useState(false);
    // Estado para la categoría actual (para edición)
    const [currentCategory, setCurrentCategory] = useState(null);
    // Estado para manejar carga de datos
    const [loading, setLoading] = useState(false);

    // Función para cargar las categorías desde el servicio
    const loadCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            alert('No se pudieron cargar las categorías. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para filtrar categorías según el término de búsqueda
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para abrir el modal de creación de categoría
    const handleNewCategory = () => {
        setCurrentCategory(null);
        setShowModal(true);
    };

    // Función para abrir el modal de edición de categoría
    const handleEditCategory = (category) => {
        setCurrentCategory(category);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCategory(null);
    };

    // Función para manejar el guardado de categoría
    const handleSaveCategory = async (categoryData) => {
        setLoading(true);
        try {
            if (categoryData.id) {
                // Actualizar categoría existente
                await CategoryService.update(categoryData.id, categoryData);
            } else {
                // Crear nueva categoría
                await CategoryService.create(categoryData);
            }
            handleCloseModal();
            loadCategories(); // Recargar la lista de categorías
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
            alert('No se pudo guardar la categoría. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la eliminación de una categoría
    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
            setLoading(true);
            try {
                await CategoryService.delete(categoryId);
                loadCategories(); // Recargar la lista de categorías
            } catch (error) {
                console.error('Error al eliminar la categoría:', error);
                alert('No se pudo eliminar la categoría. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        }
    };    return (
        <div className='w-100 h-100'>
            <div className='w-100 h-100'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Categorías</h3>
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
                                className='btn btn-theme-primary btn-sm'
                                onClick={handleNewCategory}
                                disabled={loading}
                            >
                                <span className='mx-2'>
                                    <i className="bi bi-plus-lg "></i> Nueva Categoría
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
                                <thead className="bg-theme-primary ">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map(category => (
                                            <tr key={category.id}>
                                                <td>{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>
                                                    <span className={`badge ${category.state === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                        {category.state}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-theme-seccondary me-1"
                                                        onClick={() => handleEditCategory(category)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-theme-danger"
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">No se encontraron categorías</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar categoría */}
            {showModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <CategoryForm 
                                    category={currentCategory} 
                                    onSave={handleSaveCategory} 
                                    onCancel={handleCloseModal}
                                />
                            </div>                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}