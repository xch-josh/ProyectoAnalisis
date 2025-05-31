import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { useClientContext } from '../../context/ClientContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ClientSelector from './ClientSelector';

export default function RemoveFromCartView() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { selectedClient } = useClientContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showClientSelector, setShowClientSelector] = useState(false);
    const [selectedItemsTotal, setSelectedItemsTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const searchInputRef = useRef(null);

    // Debounce para el término de búsqueda
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // Inicializar los items filtrados con todos los items del carrito
    useEffect(() => {
        setFilteredItems(cartItems);
        // Reiniciar a la primera página cuando cambia el carrito
        setCurrentPage(1);
    }, [cartItems]);

    // Filtrar items basados en el término de búsqueda
    useEffect(() => {
        if (debouncedSearchTerm.trim() === '') {
            setFilteredItems(cartItems);
        } else {
            const searchTermLower = debouncedSearchTerm.toLowerCase();
            const filtered = cartItems.filter(item => 
                item.productName.toLowerCase().includes(searchTermLower) || 
                (item.productId && item.productId.toString().toLowerCase().includes(searchTermLower))
            );
            setFilteredItems(filtered);
        }
        // Reiniciar a la primera página cuando cambia la búsqueda
        setCurrentPage(1);
    }, [debouncedSearchTerm, cartItems]);

    // Calcular el valor total de los items seleccionados
    useEffect(() => {
        const total = cartItems
            .filter(item => selectedItems.includes(item.cartId))
            .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        setSelectedItemsTotal(total);
    }, [selectedItems, cartItems]);    const handleRemoveSelected = useCallback(() => {
        if (selectedItems.length === 0) {
            alert('No ha seleccionado productos para quitar');
            return;
        }
        
        if (window.confirm(`¿Está seguro que desea quitar ${selectedItems.length} producto(s) del carrito?`)) {
            selectedItems.forEach(cartId => {
                removeFromCart(cartId);
            });
            setSelectedItems([]);
            navigate('/Cart'); // Regresar al carrito después de quitar
        }
    }, [selectedItems, removeFromCart, navigate]);

    const handleSelectItem = (cartId) => {
        if (selectedItems.includes(cartId)) {
            setSelectedItems(selectedItems.filter(id => id !== cartId));
        } else {
            setSelectedItems([...selectedItems, cartId]);
        }
    };

    const handleSelectAll = useCallback(() => {
        if (selectedItems.length === filteredItems.length) {
            // Si todos están seleccionados, deseleccionar todos
            setSelectedItems([]);
        } else {
            // Seleccionar todos los filtrados
            setSelectedItems(filteredItems.map(item => item.cartId));
        }
    }, [selectedItems.length, filteredItems]);    const handleClienteClick = useCallback(() => {
        // Mostrar selector de clientes
        setShowClientSelector(true);
    }, []);

    // Cálculo para paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para resaltar el texto de búsqueda en los elementos
    const highlightText = (text, highlight) => {
        if (!highlight.trim() || !text) return text;
        
        try {
            const regex = new RegExp(`(${highlight})`, 'gi');
            return text.toString().replace(regex, '<mark>$1</mark>');
        } catch (e) {
            return text;
        }
    };

    // Manejo de atajos de teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Alt+S para enfocar en la búsqueda
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }
            
            // Alt+A para seleccionar/deseleccionar todos
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                handleSelectAll();
            }
            
            // Alt+R para eliminar los seleccionados
            if (e.altKey && e.key === 'r' && selectedItems.length > 0) {
                e.preventDefault();
                handleRemoveSelected();
            }
            
            // Esc para volver a la vista del carrito
            if (e.key === 'Escape') {
                e.preventDefault();
                navigate('/Cart');
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedItems, navigate, handleRemoveSelected, handleSelectAll]);

    // Determinar qué pestaña está activa basada en la ruta actual
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className='w-100 h-100'>
            <div className='row'>
                {/* Header con título "Carrito - Quitar Productos" */}
                <div className='col-12' style={{ backgroundColor: '#283593', color: 'white', padding: '8px 15px', borderRadius: '4px 4px 0 0' }}>
                    <h3 className='mb-0'>Carrito - Quitar Productos</h3>
                </div>

                {/* Barra de navegación interna del carrito */}
                <div className='col-12 bg-light py-2 border-bottom'>
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link to="/Cart" className={`nav-link ${isActive('/Cart')}`}>
                                <i className="bi bi-list"></i> Vista general
                            </Link>
                        </li>
                        <li className="nav-item">
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
                </div>

                {/* Sección para buscar y quitar productos */}
                <div className='col-12'>
                    <div className='row mb-4 mt-3'>
                        <div className='col-md-4'>
                            <div className='input-group'>
                                <span className='input-group-text'>
                                    <i className="bi bi-search"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Buscar por nombre o código... (Alt+S)" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    ref={searchInputRef}
                                    aria-label="Buscar productos"
                                />
                                {searchTerm && (
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        title="Limpiar búsqueda"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <small className="text-muted d-block mt-1">
                                <span className="badge bg-secondary me-1">Alt+S</span> Buscar 
                                <span className="badge bg-secondary mx-1">Alt+A</span> Seleccionar todos 
                                <span className="badge bg-secondary mx-1">Alt+R</span> Quitar seleccionados
                                <span className="badge bg-secondary mx-1">Esc</span> Volver
                            </small>
                        </div>
                        <div className='col-md-4'>
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
                        <div className='col-md-4 d-flex justify-content-end'>
                            <button
                                className='btn btn-danger me-2'
                                onClick={handleRemoveSelected}
                                disabled={selectedItems.length === 0}
                                title="Quitar productos seleccionados (Alt+R)"
                            >
                                <i className="bi bi-trash"></i> Quitar Seleccionados 
                                {selectedItems.length > 0 && ` (${selectedItems.length} ítems - Q${selectedItemsTotal.toFixed(2)})`}
                            </button>
                            <Link to="/Cart" className="btn btn-outline-secondary" title="Volver al carrito (Esc)">
                                <i className="bi bi-arrow-left"></i> Volver al Carrito
                            </Link>
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="text-center my-5">
                            <i className="bi bi-cart-x" style={{ fontSize: '4rem' }}></i>
                            <h4 className="mt-3">El carrito está vacío</h4>
                            <p>No hay productos que quitar</p>
                            <Link to="/Cart/Add" className="btn btn-primary mt-2">
                                <i className="bi bi-plus-lg"></i> Agregar productos
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>
                                                <div className="form-check">
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-check-input" 
                                                        checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                                                        onChange={handleSelectAll}
                                                        title="Seleccionar/deseleccionar todos (Alt+A)"
                                                        id="selectAll"
                                                    />
                                                    <label className="form-check-label" htmlFor="selectAll">
                                                        Todos
                                                    </label>
                                                </div>
                                            </th>
                                            <th>Código</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unit.</th>
                                            <th>Subtotal</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    <div className="py-4">
                                                        <i className="bi bi-search" style={{ fontSize: '2rem' }}></i>
                                                        <p className="mt-2">No se encontraron productos que coincidan con la búsqueda</p>
                                                        {searchTerm && (
                                                            <button 
                                                                className="btn btn-outline-secondary btn-sm mt-2"
                                                                onClick={() => setSearchTerm('')}
                                                            >
                                                                <i className="bi bi-x-circle"></i> Limpiar búsqueda
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentItems.map((item) => (
                                                <tr key={item.cartId} className={selectedItems.includes(item.cartId) ? 'table-primary' : ''}>
                                                    <td>
                                                        <div className="form-check">
                                                            <input 
                                                                type="checkbox" 
                                                                className="form-check-input" 
                                                                checked={selectedItems.includes(item.cartId)}
                                                                onChange={() => handleSelectItem(item.cartId)}
                                                                id={`check-${item.cartId}`}
                                                            />
                                                            <label className="form-check-label" htmlFor={`check-${item.cartId}`}>
                                                                {indexOfFirstItem + currentItems.indexOf(item) + 1}
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td dangerouslySetInnerHTML={{ 
                                                        __html: highlightText(item.productId || '-', debouncedSearchTerm) 
                                                    }}></td>
                                                    <td dangerouslySetInnerHTML={{ 
                                                        __html: highlightText(item.productName, debouncedSearchTerm) 
                                                    }}></td>
                                                    <td>{item.quantity}</td>
                                                    <td>Q{item.unitPrice.toFixed(2)}</td>
                                                    <td>Q{(item.unitPrice * item.quantity).toFixed(2)}</td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-sm btn-danger" 
                                                            onClick={() => {
                                                                if (window.confirm(`¿Está seguro que desea quitar ${item.productName} del carrito?`)) {
                                                                    removeFromCart(item.cartId);
                                                                }
                                                            }}
                                                            title="Quitar este producto"
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

                            {filteredItems.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <small className="text-muted">
                                            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredItems.length)} de {filteredItems.length} productos
                                        </small>
                                    </div>
                                    
                                    {totalPages > 1 && (
                                        <nav aria-label="Paginación">
                                            <ul className="pagination pagination-sm mb-0">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => paginate(currentPage - 1)}
                                                        aria-label="Anterior"
                                                        disabled={currentPage === 1}
                                                    >
                                                        <i className="bi bi-chevron-left"></i>
                                                    </button>
                                                </li>
                                                
                                                {[...Array(totalPages).keys()].map(number => (
                                                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                                        <button 
                                                            className="page-link" 
                                                            onClick={() => paginate(number + 1)}
                                                        >
                                                            {number + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => paginate(currentPage + 1)}
                                                        aria-label="Siguiente"
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        <i className="bi bi-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {/* Modal para seleccionar cliente */}
            {showClientSelector && (
                <ClientSelector onClose={() => setShowClientSelector(false)} />
            )}
        </div>
    );
}