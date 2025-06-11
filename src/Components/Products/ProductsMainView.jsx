import React, { useState, useEffect, useCallback } from 'react';
import ProductForm from './ProductForm';
import ProductService from './ProductService';

export default function ProductsMainView() {
    // Estado para almacenar los productos
    const [products, setProducts] = useState([]);
    // Estado para manejar la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para manejar el modal de producto (nuevo/editar)
    const [showModal, setShowModal] = useState(false);
    // Estado para el producto actual (para edición)
    const [currentProduct, setCurrentProduct] = useState(null);
    // Estado para manejar carga de datos
    const [loading, setLoading] = useState(false);

    // Función para cargar los productos desde el servicio
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            // La API ahora ya incluye los datos relacionados gracias al Include en EF Core
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            alert('No se pudieron cargar los productos. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar datos iniciales al montar el componente
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para filtrar productos según el término de búsqueda
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codeBar.includes(searchTerm)
    );

    // Función para abrir el modal de creación de producto
    const handleNewProduct = () => {
        setCurrentProduct(null);
        setShowModal(true);
    };

    // Función para abrir el modal de edición de producto
    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProduct(null);
    };

    // Función para manejar el guardado de producto
    const handleSaveProduct = async (productData) => {
        setLoading(true);
        try {
            if (productData.id) {
                // Actualizar producto existente
                await ProductService.update(productData.id, productData);
            } else {
                // Crear nuevo producto
                await ProductService.create(productData);
            }
            handleCloseModal();
            loadProducts(); // Recargar la lista de productos
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            alert('No se pudo guardar el producto. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la eliminación de un producto
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
            setLoading(true);
            try {
                await ProductService.delete(productId);
                loadProducts(); // Recargar la lista de productos
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                alert('No se pudo eliminar el producto. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        }
    };    return (
        <div className='w-100 h-100'>
            <div className='w-100 h-100'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Productos</h3>
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
                                    placeholder='Buscar por nombre o código' 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end col-md-8 mb-1'>
                            <button 
                                type='button' 
                                className='btn btn-theme-primary btn-sm'
                                onClick={handleNewProduct}
                                disabled={loading}
                            >
                                <span className='mx-2'>
                                    <i className="bi bi-plus-lg"></i> Nuevo
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
                                <thead className="bg-theme-primary">
                                    <tr>
                                        <th scope="col" className="bg-theme-primary">Código</th>
                                        <th scope="col" className="bg-theme-primary">Nombre</th>
                                        <th scope="col" className="bg-theme-primary">Precio de Compra</th>
                                        <th scope="col" className="bg-theme-primary">% Ganancia</th>
                                        <th scope="col" className="bg-theme-primary">Precio Unitario</th>
                                        <th scope="col" className="bg-theme-primary">Medida</th>
                                        <th scope="col" className="bg-theme-primary">Marca</th>
                                        <th scope="col" className="bg-theme-primary">Categoría</th>
                                        <th scope="col" className="bg-theme-primary">Estado</th>
                                        <th scope="col" className="bg-theme-primary">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.codeBar}</td>
                                                <td>{product.name}</td>
                                                <td>${product.purchasePrice.toFixed(2)}</td>
                                                <td>{product.gainPercentaje}%</td>
                                                <td>${product.unitPrice.toFixed(2)}</td>
                                                <td>{product.measureName}</td>
                                                <td>{product.brandName}</td>
                                                <td>{product.categoryName}</td>
                                                <td>
                                                    <span className={`badge ${product.state === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                        {product.state}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-theme-seccondary me-1"
                                                        onClick={() => handleEditProduct(product)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-theme-danger"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center">No se encontraron productos</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar producto */}
            {showModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <ProductForm 
                                    product={currentProduct} 
                                    onSave={handleSaveProduct} 
                                    onCancel={handleCloseModal}
                                />
                            </div>                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}