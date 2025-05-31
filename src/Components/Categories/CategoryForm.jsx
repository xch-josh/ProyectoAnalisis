import React, { useState } from 'react';

export default function CategoryForm({ category, onSave, onCancel }) {
    // Estado inicial del formulario (categoría vacía o existente)
    const [formData, setFormData] = useState({
        id: category?.id || null,
        name: category?.name || '',
        state: category?.state || 'Activo'
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

    // Determinar si el botón de guardar debe estar deshabilitado
    const isSaveDisabled = !formData.name;

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <div className="col-md-12">
                    <label htmlFor="name" className="form-label">Nombre de la Categoría</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="state" className="form-label">Estado</label>
                    <select 
                        className="form-select" 
                        id="state" 
                        name="state" 
                        value={formData.state} 
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