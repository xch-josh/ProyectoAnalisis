import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useClientContext } from '../../context/ClientContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ClientSelector from './ClientSelector';
import SaleService from '../../services/SaleService';
import { toast } from 'react-toastify';

export default function CheckoutView() {
    const { cartItems, total, subtotal, discount, clearCart } = useCart();
    const { selectedClient, clearSelectedClient } = useClientContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountTendered, setAmountTendered] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        email: '',
        documentId: ''
    });
    const [showClientSelector, setShowClientSelector] = useState(false);
    
    // Actualizar información del cliente cuando se selecciona uno
    useEffect(() => {
        if (selectedClient) {
            setCustomerInfo({
                name: selectedClient.name || '',
                phone: selectedClient.phone || '',
                email: selectedClient.mail || '',
                documentId: selectedClient.clientId || ''
            });
        }
    }, [selectedClient]);

    const [branch, setBranch] = useState('1'); // Valor por defecto, idealmente vendría de una API

    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [change, setChange] = useState(0);
    const [invoiceId, setInvoiceId] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (paymentMethod === 'cash' && (!amountTendered || parseFloat(amountTendered) < total)) {
            newErrors.amountTendered = 'El monto debe ser mayor o igual al total';
        }

        // En una aplicación real, podrías validar más campos según tus requisitos

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    const handleSubmit = async () => {
        if (!validateForm()) return;

        // Calcular cambio si es pago en efectivo
        if (paymentMethod === 'cash') {
            const tenderedAmount = parseFloat(amountTendered);
            setChange(tenderedAmount - total);
        }

        try {
            // Preparar los datos para la API
            // Crear objeto de venta
            const sale = {
                date: new Date().toISOString(),
                total: total,
                state: true,
                clientId: selectedClient?.clientId || 1, // Cliente por defecto o el seleccionado
                branchId: parseInt(branch),
                userId: 1 // Usuario por defecto, idealmente vendría del contexto de autenticación
            };
            
            // Crear detalles de venta
            const details = cartItems.map(item => ({
                quantity: item.quantity,
                purchasePrice: item.unitPrice, // Asumiendo que el precio de compra es igual al unitario
                unitPrice: item.unitPrice,
                discount: item.discount || 0,
                salePrice: item.unitPrice - (item.discount || 0),
                subtotal: (item.unitPrice - (item.discount || 0)) * item.quantity,
                productId: item.productId,
                saleId: 0 // El backend asignará el ID correcto
            }));

            // Enviar los datos a la API
            const response = await SaleService.createSale({ sale, details });
            
            // Generar ID de factura desde la respuesta del backend o generar uno local
            const newInvoiceId = response?.saleId ? `INV-${response.saleId}` : `INV-${new Date().getTime().toString().slice(-8)}`;
            setInvoiceId(newInvoiceId);

            // Mostrar toast de éxito
            toast.success('Venta registrada correctamente!');

            // Mostrar modal de éxito
            setShowSuccessModal(true);
            
            console.log('Venta procesada correctamente:', response);
        } catch (error) {
            console.error('Error al procesar la venta:', error);
            toast.error('Error al procesar la venta. Intente nuevamente.');
        }
    };    const handleFinishSale = async () => {
        try {
            await clearCart(); // Limpiar el carrito usando el método del contexto que ya está conectado a la API
            toast.success('¡Compra finalizada con éxito!');
            navigate('/Cart'); // Redirigir al carrito vacío
        } catch (error) {
            console.error('Error al finalizar la venta:', error);
            toast.error('Error al finalizar la venta. El carrito no se pudo limpiar.');
            // Aún así redirigimos al usuario
            navigate('/Cart');
        }
    };

    const handleClienteClick = () => {
        // Abrir el selector de clientes
        setShowClientSelector(true);
    };

    // Determinar qué pestaña está activa basada en la ruta actual
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    // No realizar cobro si el carrito está vacío
    if (cartItems.length === 0) {
        return (
            <div className='w-100 h-100 overflow-auto'>
                <div className='row'>
                    {/* Header con título */}
                    <div className='col-12' style={{ backgroundColor: '#283593', color: 'white', padding: '8px 15px', borderRadius: '4px 4px 0 0' }}>
                        <h3 className='mb-0'>Carrito - Finalizar Compra</h3>
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
                            </li>                            <li className="nav-item">
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

                    <div className="text-center my-5">
                        <i className="bi bi-cart-x" style={{ fontSize: '4rem' }}></i>
                        <h4 className="mt-3">No hay productos en el carrito</h4>
                        <p>Agrega productos antes de proceder al pago</p>
                        <Link to="/Cart/Add" className="btn btn-primary mt-2">
                            <i className="bi bi-plus-lg"></i> Agregar productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-100 h-100 overflow-auto'>
            <div className='row'>
                {/* Header con título */}
                <div className='col-12' style={{ backgroundColor: '#283593', color: 'white', padding: '8px 15px', borderRadius: '4px 4px 0 0' }}>
                    <h3 className='mb-0'>Carrito - Finalizar Compra</h3>
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
                        </li>                        <li className="nav-item">
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

                <div className='row mt-3'>
                    <div className='col-md-8'>
                        <div className='card mb-4'>
                            <div className='card-body'>
                                <h5 className='card-title mb-3'>Información de Pago</h5>
                                
                                <div className='mb-3'>
                                    <label className='form-label'>Método de Pago</label>
                                    <div className='d-flex'>
                                        <div className='form-check me-4'>
                                            <input 
                                                className='form-check-input' 
                                                type='radio' 
                                                name='paymentMethod' 
                                                id='cashPayment'
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => setPaymentMethod('cash')}
                                            />
                                            <label className='form-check-label' htmlFor='cashPayment'>
                                                Efectivo
                                            </label>
                                        </div>
                                        <div className='form-check me-4'>
                                            <input 
                                                className='form-check-input' 
                                                type='radio' 
                                                name='paymentMethod' 
                                                id='cardPayment'
                                                checked={paymentMethod === 'card'}
                                                onChange={() => setPaymentMethod('card')}
                                            />
                                            <label className='form-check-label' htmlFor='cardPayment'>
                                                Tarjeta
                                            </label>
                                        </div>
                                        <div className='form-check'>
                                            <input 
                                                className='form-check-input' 
                                                type='radio' 
                                                name='paymentMethod' 
                                                id='transferPayment'
                                                checked={paymentMethod === 'transfer'}
                                                onChange={() => setPaymentMethod('transfer')}
                                            />
                                            <label className='form-check-label' htmlFor='transferPayment'>
                                                Transferencia
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'cash' && (
                                    <div className='mb-3'>
                                        <label htmlFor='amountTendered' className='form-label'>Monto Entregado</label>
                                        <div className='input-group'>
                                            <span className='input-group-text'>Q</span>
                                            <input 
                                                type='number' 
                                                className={`form-control ${errors.amountTendered ? 'is-invalid' : ''}`}
                                                id='amountTendered'
                                                value={amountTendered}
                                                onChange={(e) => setAmountTendered(e.target.value)}
                                                min={total}
                                                step='any'
                                            />
                                            {errors.amountTendered && (
                                                <div className='invalid-feedback'>{errors.amountTendered}</div>
                                            )}
                                        </div>
                                        {amountTendered && parseFloat(amountTendered) >= total && (
                                            <small className='text-success'>
                                                Cambio a devolver: Q{(parseFloat(amountTendered) - total).toFixed(2)}
                                            </small>
                                        )}
                                    </div>
                                )}                                <h5 className='card-title mb-3 mt-4'>Acciones Rápidas</h5>
                                <div className='list-group mb-4'>
                                    <button 
                                        className='list-group-item list-group-item-action d-flex align-items-center fw-bold'
                                        style={{ 
                                            backgroundColor: '#3050ff', 
                                            color: 'white', 
                                            border: '2px solid #2040cc',
                                            padding: '10px 15px',
                                            margin: '5px 0'
                                        }}
                                        onClick={handleClienteClick}
                                    >
                                        <i className="bi bi-person-fill me-2" style={{ fontSize: '1.2rem' }}></i> {selectedClient ? 'Cambiar Cliente' : 'Seleccionar Cliente'}
                                    </button>
                                    <button 
                                        className='list-group-item list-group-item-action d-flex align-items-center fw-bold'
                                        style={{ 
                                            backgroundColor: selectedClient ? '#ff3030' : '#aaaaaa', 
                                            color: 'white', 
                                            border: selectedClient ? '2px solid #cc0000' : '2px solid #999999',
                                            padding: '10px 15px',
                                            margin: '5px 0'
                                        }}
                                        onClick={() => {
                                            if(selectedClient) {
                                                // Limpiar el cliente seleccionado
                                                clearSelectedClient();
                                                setCustomerInfo({
                                                    name: '',
                                                    phone: '',
                                                    email: '',
                                                    documentId: ''
                                                });
                                            }
                                        }}
                                        disabled={!selectedClient}
                                    >
                                        <i className="bi bi-trash-fill me-2" style={{ fontSize: '1.2rem' }}></i> Quitar Cliente
                                    </button>
                                </div>
                                
                                <h5 className='card-title mb-3'>Información del Cliente</h5>
                                {selectedClient && (
                                    <div className="alert alert-info mb-3">
                                        <small>Cliente registrado seleccionado: <strong>{selectedClient.name}</strong></small>
                                    </div>
                                )}
                                <div className='mb-3'>
                                    <label htmlFor='customerName' className='form-label'>Nombre</label>
                                    <input 
                                        type='text' 
                                        className='form-control'
                                        id='customerName'
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                    />
                                </div>

                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label htmlFor='customerPhone' className='form-label'>Teléfono</label>
                                        <input 
                                            type='tel' 
                                            className='form-control'
                                            id='customerPhone'
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className='col'>
                                        <label htmlFor='customerEmail' className='form-label'>Email</label>
                                        <input 
                                            type='email' 
                                            className='form-control'
                                            id='customerEmail'
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='documentId' className='form-label'>Documento de Identidad</label>
                                    <input 
                                        type='text' 
                                        className='form-control'
                                        id='documentId'
                                        value={customerInfo.documentId}
                                        onChange={(e) => setCustomerInfo({...customerInfo, documentId: e.target.value})}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='branch' className='form-label'>Sucursal</label>
                                    <select 
                                        className='form-select'
                                        id='branch'
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                    >
                                        <option value='1'>Sucursal Principal</option>
                                        <option value='2'>Sucursal Norte</option>
                                        <option value='3'>Sucursal Sur</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className='card'>
                            <div className='card-body'>                                <h5 className='card-title'>Resumen de Compra</h5>
                                
                                <div className='border-bottom pb-2 mb-2'>
                                    <small className='text-muted'>Productos: {cartItems.length}</small>
                                    {selectedClient && (
                                        <div className="mt-2 p-2 bg-light rounded border">
                                            <h6 className="mb-1"><i className="bi bi-person me-1"></i> Cliente</h6>
                                            <small className="d-block"><strong>Nombre:</strong> {selectedClient.name}</small>
                                            <small className="d-block"><strong>ID:</strong> {selectedClient.clientId}</small>
                                            <small className="d-block"><strong>Teléfono:</strong> {selectedClient.phone}</small>
                                        </div>
                                    )}
                                </div>

                                {cartItems.map((item) => (
                                    <div key={item.cartId} className='d-flex justify-content-between mb-2'>
                                        <span>{item.productName} x{item.quantity}</span>
                                        <span>Q{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}

                                <div className='border-top pt-2 mt-3'>
                                    <div className='d-flex justify-content-between mb-2'>
                                        <span>Subtotal:</span>
                                        <span>Q{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className='d-flex justify-content-between mb-2'>
                                        <span>Descuento:</span>
                                        <span>-Q{discount.toFixed(2)}</span>
                                    </div>
                                    <div className='d-flex justify-content-between mb-2 fw-bold'>
                                        <span>Total:</span>
                                        <span>Q{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className='d-grid gap-2 mt-3'>
                                    <button 
                                        className='btn btn-success'
                                        onClick={handleSubmit}
                                    >
                                        <i className='bi bi-check-circle'></i> Finalizar Compra
                                    </button>
                                    <Link to="/Cart" className='btn btn-outline-secondary'>
                                        <i className='bi bi-arrow-left'></i> Volver al Carrito
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Compra Exitosa */}
            {showSuccessModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                     style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
                        <div className="text-center mb-4">
                            <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-2">¡Compra Exitosa!</h4>
                            <p>La transacción se ha completado correctamente</p>
                        </div>                        <div className="mb-3">
                            <p className="mb-1"><strong>Factura #:</strong> {invoiceId}</p>
                            <p className="mb-1"><strong>Total pagado:</strong> Q{total.toFixed(2)}</p>
                            {paymentMethod === 'cash' && (
                                <>
                                    <p className="mb-1"><strong>Monto recibido:</strong> Q{parseFloat(amountTendered).toFixed(2)}</p>
                                    <p className="mb-1"><strong>Cambio:</strong> Q{change.toFixed(2)}</p>
                                </>
                            )}
                            <p className="mb-1"><strong>Método de pago:</strong> {
                                paymentMethod === 'cash' ? 'Efectivo' : 
                                paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'
                            }</p>
                            
                            {selectedClient && (
                                <div className="mt-3 pt-2 border-top">
                                    <p className="mb-1"><strong>Cliente:</strong> {selectedClient.name}</p>
                                    <p className="mb-1"><strong>ID Cliente:</strong> {selectedClient.clientId}</p>
                                    <p className="mb-1"><strong>Teléfono:</strong> {selectedClient.phone}</p>
                                </div>
                            )}
                        </div>

                        <div className="d-grid">
                            <button 
                                className="btn btn-primary"
                                onClick={handleFinishSale}
                            >
                                <i className="bi bi-arrow-right"></i> Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal para seleccionar cliente */}
            {showClientSelector && (
                <ClientSelector onClose={() => setShowClientSelector(false)} />
            )}
        </div>
    );
}