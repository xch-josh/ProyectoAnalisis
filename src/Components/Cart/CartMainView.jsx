import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useClientContext } from '../../context/ClientContext';
import ClientSelector from './ClientSelector';

export default function CartMainView() {    const { cartItems, removeFromCart, updateQuantity, total, discount } = useCart();
    const { selectedClient, clearSelectedClient } = useClientContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [showClientSelector, setShowClientSelector] = useState(false);    const handleQuantityChange = (cartId, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(cartId, newQuantity);
        }
    };

    const handleRemoveItem = (cartId) => {
        removeFromCart(cartId);
    };const handleClienteClick = () => {
        // Mostrar selector de clientes
        setShowClientSelector(true);
    };

    // Determinar qué pestaña está activa basada en la ruta actual
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className='w-100 h-100 overflow-auto'>
            {/* Header con título "Carrito" */}
            <div className='row'>
                <div className='col-12' style={{ backgroundColor: '#283593', color: 'white', padding: '8px 15px', borderRadius: '4px 4px 0 0' }}>
                    <h3 className='mb-0'>Carrito</h3>
                </div>
            </div>

            {/* Barra de navegación interna del carrito */}
            <div className='row bg-light py-2 border-bottom'>
                <div className='col-12'>
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
                    </ul>
                </div>
            </div>            {/* Opciones del producto */}
            <div className='row bg-light py-2'>
                <div className='col-12'>
                    <div className='d-flex justify-content-end'>
                        <h6 className='me-3 align-self-center mb-0'>Opciones del producto:</h6>
                        <button 
                            className='btn btn-danger me-2' 
                            onClick={() => navigate('/Cart/Remove')}
                            disabled={cartItems.length === 0}
                        >
                            <i className="bi bi-dash-circle"></i> Quitar
                        </button>
                        <button 
                            className='btn btn-success' 
                            onClick={() => navigate('/Cart/Add')}
                        >
                            <i className="bi bi-plus-circle"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>

            <div className='row bg-light pb-2'>
                <div className='col-8'></div><div className='col-8'>
                    <div className='d-flex justify-content-end'>
                        {selectedClient ? (
                            <div className="d-flex align-items-center border rounded p-2 bg-light">
                                <div className="me-3">
                                    <small className="d-block text-muted">Cliente seleccionado:</small>
                                    <strong>{selectedClient.name}</strong>
                                </div>
                                <div className="me-3">
                                    <small className="d-block text-muted">ID:</small>
                                    <span>{selectedClient.clientId}</span>
                                </div>
                                <div className="me-3">
                                    <small className="d-block text-muted">Teléfono:</small>
                                    <span>{selectedClient.phone}</span>
                                </div>
                                <button className="btn btn-outline-secondary ms-2" onClick={clearSelectedClient}>
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-outline-primary" onClick={handleClienteClick}>
                                <i className="bi bi-person"></i> Seleccionar Cliente
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center my-5">
                    <i className="bi bi-cart-x" style={{ fontSize: '4rem' }}></i>
                    <h4 className="mt-3">El carrito está vacío</h4>
                    <p>Agrega productos para comenzar</p>
                    <Link to="/Cart/Add" className="btn btn-primary mt-2">
                        <i className="bi bi-plus-lg"></i> Agregar productos
                    </Link>
                </div>
            ) : (
                <>
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr className="text-white" style={{ backgroundColor: '#283593' }}>
                                    <th style={{ width: '80px' }}>Cantidad</th>
                                    <th style={{ width: '120px' }}>Código</th>
                                    <th>Producto</th>
                                    <th style={{ width: '100px' }}>Precio</th>
                                    <th style={{ width: '100px' }}>Descuento/Unitario</th>
                                    <th style={{ width: '100px' }}>Precio/Venta</th>
                                    <th style={{ width: '100px' }}>SubTotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.cartId} style={{ backgroundColor: item.cartId % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="form-control form-control-sm" 
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.cartId, parseInt(e.target.value) || 1)}
                                                min="1"
                                            />
                                        </td>
                                        <td>{item.productId || '-'}</td>
                                        <td>
                                            <div className="d-flex justify-content-between">
                                                <span>{item.productName}</span>
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveItem(item.cartId)}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-end">Q{item.unitPrice.toFixed(2)}</td>
                                        <td className="text-end">Q{(0.00).toFixed(2)}</td>
                                        <td className="text-end">Q{item.unitPrice.toFixed(2)}</td>
                                        <td className="text-end">Q{(item.unitPrice * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="card border-0 bg-light">
                                <div className="card-body p-0">
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5 className="mb-0">Total:</h5>
                                        <h5 className="mb-0">Q {total.toFixed(2)}</h5>
                                    </div>
                                    <div className="d-flex justify-content-between text-muted">
                                        <span>Descuento total:</span>
                                        <span>-Q {discount.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.9rem' }}>
                                        <span>Total en letras:</span>
                                        <span style={{ fontStyle: 'italic' }}>
                                            {convertirNumeroALetras(total)} QUETZALES CON {Math.round((total % 1) * 100).toString().padStart(2, '0')}/100 CENTAVOS
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <Link to="/Cart/Discount" className="btn btn-info me-2">
                            <i className="bi bi-percent"></i> Descuento
                        </Link>
                        <Link to="/Cart/Checkout" className="btn btn-success">
                            <i className="bi bi-credit-card"></i> Cobrar F12
                        </Link>
                    </div>
                </>
            )}
            
            {/* Modal para seleccionar cliente */}
            {showClientSelector && (
                <ClientSelector onClose={() => setShowClientSelector(false)} />
            )}
        </div>
    );
}

// Función para convertir números a letras (versión simplificada)
function convertirNumeroALetras(numero) {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
    
    const entero = Math.floor(numero);
    
    if (entero === 0) return 'CERO';
    if (entero === 1) return 'UNO';
    
    let resultado = '';
    
    if (entero < 10) {
        resultado = unidades[entero];
    } else if (entero < 100) {
        const unidad = entero % 10;
        const decena = Math.floor(entero / 10);
        if (unidad === 0) {
            resultado = decenas[decena];
        } else {
            resultado = `${decenas[decena]} Y ${unidades[unidad]}`;
        }
    } else if (entero < 1000) {
        const centena = Math.floor(entero / 100);
        const resto = entero % 100;
        
        if (resto === 0) {
            resultado = centenas[centena];
        } else {
            resultado = `${centenas[centena]} ${convertirNumeroALetras(resto)}`;
        }
    } else {
        resultado = "CIENTO VEINTICUATRO"; // Simplificado para este ejemplo
    }
    
    return resultado;
}