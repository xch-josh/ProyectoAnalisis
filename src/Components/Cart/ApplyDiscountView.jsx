import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useClientContext } from '../../context/ClientContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ClientSelector from './ClientSelector';

export default function ApplyDiscountView() {
    const { subtotal, discount, applyDiscount, cartItems, clearCart } = useCart();
    const { selectedClient } = useClientContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showClientSelector, setShowClientSelector] = useState(false);    const calculateDiscount = () => {
        // Validar que se ha ingresado un número válido
        if (!discountValue || isNaN(discountValue)) {
            setErrorMessage('Por favor ingresa un valor válido');
            return;
        }

        const numericValue = parseFloat(discountValue);

        // Validar rango según tipo de descuento
        if (discountType === 'percentage') {
            if (numericValue < 0 || numericValue > 100) {
                setErrorMessage('El porcentaje debe estar entre 0 y 100');
                return;
            }
            // Calcular descuento por porcentaje
            const discountAmount = (subtotal * numericValue) / 100;
            applyDiscount(discountAmount);
        } else {
            if (numericValue < 0 || numericValue > subtotal) {
                setErrorMessage(`El monto debe estar entre 0 y ${subtotal.toFixed(2)}`);
                return;
            }
            // Aplicar descuento directo
            applyDiscount(numericValue);
        }

        navigate('/Cart'); // Regresar al carrito
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
                {/* Header con título "Carrito - Aplicar Descuento" */}
                <div className='col-12' style={{ backgroundColor: '#283593', color: 'white', padding: '8px 15px', borderRadius: '4px 4px 0 0' }}>
                    <h3 className='mb-0'>Carrito - Aplicar Descuento</h3>
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
                        <li className="nav-item">                            <button 
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
                        </li>                    </ul>
                </div>
                
                {/* Cliente seleccionado (si existe) */}
                <div className="row bg-light pb-2">
                    <div className="col-12 d-flex justify-content-end">
                        {selectedClient ? (
                            <div className="d-flex align-items-center border rounded p-2 bg-white">
                                <div className="me-3">
                                    <small className="d-block text-muted">Cliente seleccionado:</small>
                                    <strong>{selectedClient.name}</strong>
                                </div>
                                <div className="me-3">
                                    <small className="d-block text-muted">ID:</small>
                                    <span>{selectedClient.clientId}</span>
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-outline-primary" onClick={handleClienteClick}>
                                <i className="bi bi-person"></i> Seleccionar Cliente
                            </button>
                        )}
                    </div>
                </div>

                <div className="row justify-content-center mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Información del Descuento</h5>

                                <div className="mb-3">
                                    <label className="form-label">Subtotal actual</label>
                                    <div className="input-group">
                                        <span className="input-group-text">Q</span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={subtotal.toFixed(2)} 
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Descuento actual</label>
                                    <div className="input-group">
                                        <span className="input-group-text">Q</span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={discount.toFixed(2)} 
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tipo de descuento</label>
                                    <div className="d-flex">
                                        <div className="form-check me-4">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="discountType" 
                                                id="percentageDiscount"
                                                checked={discountType === 'percentage'}
                                                onChange={() => setDiscountType('percentage')}
                                            />
                                            <label className="form-check-label" htmlFor="percentageDiscount">
                                                Porcentaje (%)
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="discountType" 
                                                id="amountDiscount"
                                                checked={discountType === 'amount'}
                                                onChange={() => setDiscountType('amount')}
                                            />
                                            <label className="form-check-label" htmlFor="amountDiscount">
                                                Monto (Q)
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="discountValue" className="form-label">
                                        {discountType === 'percentage' ? 'Porcentaje de descuento' : 'Monto de descuento'}
                                    </label>
                                    <div className="input-group">
                                        {discountType === 'amount' && <span className="input-group-text">Q</span>}
                                        <input 
                                            type="number" 
                                            className={`form-control ${errorMessage ? 'is-invalid' : ''}`} 
                                            id="discountValue"
                                            value={discountValue}
                                            onChange={(e) => {
                                                setDiscountValue(e.target.value);
                                                setErrorMessage('');
                                            }}
                                            min="0"
                                            max={discountType === 'percentage' ? '100' : subtotal}
                                            step="any"
                                        />
                                        {discountType === 'percentage' && <span className="input-group-text">%</span>}
                                        {errorMessage && (
                                            <div className="invalid-feedback">{errorMessage}</div>
                                        )}
                                    </div>
                                    {discountType === 'percentage' && (
                                        <small className="text-muted">
                                            Equivalente a: Q{discountValue ? ((subtotal * parseFloat(discountValue)) / 100).toFixed(2) : '0.00'}
                                        </small>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={calculateDiscount}
                                    >
                                        <i className="bi bi-check-lg"></i> Aplicar Descuento
                                    </button>
                                    <Link to="/Cart" className="btn btn-outline-secondary">
                                        <i className="bi bi-arrow-left"></i> Volver al Carrito
                                    </Link>
                                </div>
                            </div>                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal para seleccionar cliente */}
            {showClientSelector && (
                <ClientSelector onClose={() => setShowClientSelector(false)} />
            )}
        </div>
    );
}