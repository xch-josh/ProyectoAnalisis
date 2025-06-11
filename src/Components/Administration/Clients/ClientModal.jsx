import React, { useState, useEffect } from 'react';

export default function ClientModal({ show, handleClose, handleSave, client }) {    const [formData, setFormData] = useState({
        clientId: 0,
        name: '',
        direction: '',
        phone: '',
        mail: '',
        state: true
    });

    const [errors, setErrors] = useState({});

    // Cuando se edita un cliente existente, cargamos sus datos
    useEffect(() => {
        if (client) {
            setFormData(client);        } else {
            // Resetear el formulario si es un nuevo cliente
            setFormData({
                clientId: 0,
                name: '',
                direction: '',
                phone: '',
                mail: '',
                state: true
            });
        }
        setErrors({});
    }, [client]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.direction.trim()) newErrors.direction = 'La dirección es obligatoria';
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
        
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.mail && !emailRegex.test(formData.mail)) {
            newErrors.mail = 'Formato de correo inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        
        // Convertir el estado a boolean
        if (name === 'state') {
            newValue = value === 'true';
        }
        
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
        
        // Limpiar error cuando el usuario comienza a escribir
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleSave(formData);
        }
    };

    // No renderizar si show es false
    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header bg-theme-primary">
                        <h5 className="modal-title">
                            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            aria-label="Close" 
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {client && (
                                <div className="mb-3">
                                    <label htmlFor="clientId" className="form-label">ID de Cliente</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="clientId" 
                                        name="clientId"
                                        value={formData.clientId} 
                                        disabled
                                    />
                                    <small className="text-muted">Este campo se genera automáticamente</small>
                                </div>
                            )}
                            
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre*</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                                    id="name" 
                                    name="name"
                                    value={formData.name} 
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="direction" className="form-label">Dirección*</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.direction ? 'is-invalid' : ''}`} 
                                    id="direction" 
                                    name="direction"
                                    value={formData.direction} 
                                    onChange={handleChange}
                                    required
                                />
                                {errors.direction && <div className="invalid-feedback">{errors.direction}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Teléfono*</label>
                                <input 
                                    type="tel" 
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`} 
                                    id="phone" 
                                    name="phone"
                                    value={formData.phone} 
                                    onChange={handleChange}
                                    required
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="mail" className="form-label">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.mail ? 'is-invalid' : ''}`} 
                                    id="mail" 
                                    name="mail"
                                    value={formData.mail} 
                                    onChange={handleChange}
                                />
                                {errors.mail && <div className="invalid-feedback">{errors.mail}</div>}
                            </div>
                              <div className="mb-3">
                                <label htmlFor="state" className="form-label">Estado</label>
                                <select 
                                    className="form-select" 
                                    id="state" 
                                    name="state"
                                    value={formData.state.toString()} 
                                    onChange={handleChange}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                            
                            <div className="modal-footer border-0 px-0">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    Cancelar
                                </button>                                <button type="submit" className="btn btn-theme-primary">
                                    {client ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
