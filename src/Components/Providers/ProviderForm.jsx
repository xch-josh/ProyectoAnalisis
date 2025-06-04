import React, { useState } from 'react';

export default function ProviderForm({ provider, onSave, onCancel }) {
    // Estado inicial del formulario (proveedor vacío o existente)
    const [formData, setFormData] = useState({
        id: provider?.id || null,
        Provider_ID: provider?.Provider_ID || '',
        Name: provider?.Name || '',
        Direction: provider?.Direction || '',
        Phone: provider?.Phone || '',
        Mail: provider?.Mail || '',
        State: provider?.State || 'Activo'
    });

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // Validar formato de correo electrónico
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validar formato de teléfono
    const validatePhone = (phone) => {
        // Permite formatos comunes como: 555-1234-5678, (555) 123-4567, 5551234567
        const regex = /^[0-9()\- ]+$/;
        return regex.test(phone);
    };    // Determinar si el botón de guardar debe estar deshabilitado
    const isSaveDisabled = !formData.Name || !formData.Direction || 
        !formData.Phone || !validatePhone(formData.Phone) || 
        !formData.Mail || !validateEmail(formData.Mail);

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">                <div className="col-md-6">
                    <label htmlFor="Provider_ID" className="form-label">Código de Proveedor</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Provider_ID" 
                        name="Provider_ID" 
                        value={formData.Provider_ID} 
                        onChange={handleChange}
                        placeholder="Se generará automáticamente"
                        readOnly
                    />
                    <small className="text-muted">
                        Se genera automáticamente al guardar el proveedor.
                    </small>
                </div>
                <div className="col-md-6">
                    <label htmlFor="Name" className="form-label">Nombre del Proveedor</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Name" 
                        name="Name" 
                        value={formData.Name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-12">
                    <label htmlFor="Direction" className="form-label">Dirección</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Direction" 
                        name="Direction" 
                        value={formData.Direction} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="Phone" className="form-label">Teléfono</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="Phone" 
                        name="Phone" 
                        value={formData.Phone} 
                        onChange={handleChange} 
                        required 
                    />
                    {formData.Phone && !validatePhone(formData.Phone) && (
                        <div className="text-danger">
                            Formato de teléfono inválido
                        </div>
                    )}
                </div>
                <div className="col-md-6">
                    <label htmlFor="Mail" className="form-label">Correo Electrónico</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="Mail" 
                        name="Mail" 
                        value={formData.Mail} 
                        onChange={handleChange} 
                        required 
                    />
                    {formData.Mail && !validateEmail(formData.Mail) && (
                        <div className="text-danger">
                            Formato de correo electrónico inválido
                        </div>
                    )}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="State" className="form-label">Estado</label>
                    <select 
                        className="form-select" 
                        id="State" 
                        name="State" 
                        value={formData.State} 
                        onChange={handleChange}
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSaveDisabled}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}