import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useClientContext } from '../../context/ClientContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ClientSelector from './ClientSelector';
import ProductService from '../../services/ProductService';
import { toast } from 'react-toastify';

export default function AddToCartView() {
    const { addToCart, cartItems, clearCart } = useCart();
    const { selectedClient } = useClientContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showClientSelector, setShowClientSelector] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar datos de productos desde la API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const productsData = await ProductService.getAllProducts();
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                toast.error('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);    // Filtrar productos basados en el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (product.category && product.category.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.codeBar && product.codeBar.includes(searchTerm))
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleAddToCart = async (product) => {
        try {
            setLoading(true);
            await addToCart(product, quantity);
            navigate('/Cart'); // Redirigir al carrito después de añadir
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            toast.error('No se pudo agregar el producto al carrito');
        } finally {
            setLoading(false);
        }
    };

    const handleClienteClick = () => {
        // Mostrar selector de clientes
        setShowClientSelector(true);
    };

    // Determinar qué pestaña está activa basada en la ruta actual
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className='w-100 h-100'>
            <div className='row'>
                {/* Header con título "Carrito - Agregar Productos" */}
                <div className='col-12' style={{ backgroundColor: '#283593', color: 'white', padding: '8px 15px', borderRadius: '4px 4px 0 0' }}>
                    <h3 className='mb-0'>Carrito - Agregar Productos</h3>
                </div>

                {/* Barra de navegación interna del carrito */}
                <div className='col-12 bg-light py-2 border-bottom'>
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link to="/Cart" className={`nav-link ${isActive('/Cart')}`}>
                                <i className="bi bi-list"></i> Vista general
                            </Link>
                        </li>                        <li className="nav-item">
                            <Link to="/Cart/Add" className={`nav-link ${isActive('/Cart/Add')}`}>
                                <i className="bi bi-plus-lg"></i> Agregar
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Cart/Remove" className={`nav-link ${isActive('/Cart/Remove')}`}>
                                <i className="bi bi-dash-lg"></i> Quitar
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Cart/Discount" className={`nav-link ${isActive('/Cart/Discount')}`}>
                                <i className="bi bi-percent"></i> Descuento
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Cart/Checkout" className={`nav-link ${isActive('/Cart/Checkout')}`}>
                                <i className="bi bi-credit-card"></i> Pantalla Cobro
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleClienteClick}>
                                <i className="bi bi-person"></i> Cliente
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className="nav-link text-danger" 
                                onClick={() => {
                                    if (window.confirm('¿Está seguro que desea vaciar el carrito?')) {
                                        clearCart();
                                    }
                                }}
                                disabled={cartItems.length === 0}
                            >
                                <i className="bi bi-trash"></i> Limpiar
                            </button>
                        </li>
                    </ul>
                </div>                <div className='col-12'>
                    <div className='row mb-4 mt-3'>
                        <div className='col-md-4'>
                            <div className='input-group'>
                                <span className='input-group-text'>
                                    <i className="bi bi-search"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Buscar productos..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='col-md-2'>
                            <div className='input-group'>
                                <span className='input-group-text'>Cantidad</span>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            {selectedClient ? (
                                <div className="d-flex align-items-center border rounded p-2 bg-light">
                                    <div>
                                        <small className="d-block text-muted">Cliente:</small>
                                        <strong>{selectedClient.name}</strong>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn btn-outline-primary" onClick={handleClienteClick}>
                                    <i className="bi bi-person"></i> Seleccionar Cliente
                                </button>
                            )}
                        </div>
                        <div className='col-md-3 d-flex justify-content-end'>
                            <Link to="/Cart" className="btn btn-outline-secondary">
                                <i className="bi bi-arrow-left"></i> Volver al Carrito
                            </Link>
                        </div>
                    </div>

                    <div className='row'>                        {loading ? (
                            <div className="col-12 text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="mt-3">Cargando productos...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-12 text-center my-5">
                                <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                                <h4 className="mt-3">No se encontraron productos</h4>
                                <p>Intenta con otra búsqueda</p>
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <div className="col-md-4 mb-4" key={product.productId}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">
                                                <span className="badge bg-info me-2">{product.category?.name || 'Sin categoría'}</span>
                                                <span className="badge bg-primary me-2">{product.brand?.name || 'Sin marca'}</span>
                                                {/* Stock sería manejado con un servicio de inventario */}
                                            </p>
                                            <div className="mb-2">
                                                <small className="text-muted">Código: {product.codeBar}</small>
                                            </div>
                                            <h6 className="card-subtitle mb-2 text-muted">
                                                Precio: Q{product.unitPrice.toFixed(2)}
                                            </h6>
                                        </div>
                                        <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between">
                                            <button 
                                                className="btn btn-primary w-100" 
                                                onClick={() => {
                                                    console.log(product);

                                                    const dataModel = {
                                                        "quantity": quantity,
                                                        "purchasePrice": product.purchasePrice,
                                                        "unitPrice": product.unitPrice,
                                                        "discount": 0,
                                                        "salePrice": product.unitPrice,
                                                        "subtotal": (product.unitPrice * quantity),
                                                        "productId": product.productId,
                                                        "userId": sessionStorage.getItem('userId'),
                                                        "branchId": sessionStorage.getItem('branchId')
                                                    };

                                                    handleAddToCart(dataModel);
                                                }}
                                                disabled={loading}
                                            >
                                                <i className="bi bi-cart-plus"></i> Agregar al carrito
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>                </div>
            </div>
            
            {/* Modal para seleccionar cliente */}
            {showClientSelector && (
                <ClientSelector onClose={() => setShowClientSelector(false)} />
            )}
        </div>
    );
}