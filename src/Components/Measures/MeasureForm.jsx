import React, { useState, useEffect } from 'react';
import MeasureService from './MeasureService';

const MeasureForm = ({ measureToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    measureId: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (measureToEdit) {
      setFormData({
        measureId: measureToEdit.measureId || '',
        name: measureToEdit.name || ''
      });
    } else {
      setFormData({
        measureId: '',
        name: ''
      });
    }
    setErrors({});
  }, [measureToEdit]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const validation = MeasureService.validateMeasureData(formData);
    
    if (!validation.isValid) {
      const newErrors = {};
      validation.errors.forEach(error => {
        if (error.includes('nombre')) {
          newErrors.name = error;
        }
      });
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (measureToEdit) {
        // Actualizar medida existente
        await MeasureService.updateMeasure(formData);
      } else {
        // Crear nueva medida
        await MeasureService.createMeasure(formData);
      }

      // Notificar al componente padre que se guardó exitosamente
      onSave();
      
      // Limpiar formulario si es creación
      if (!measureToEdit) {
        setFormData({ measureId: '', name: '' });
      }
    } catch (error) {
      console.error('Error al guardar medida:', error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h3>{measureToEdit ? 'Editar Medida' : 'Nueva Medida'}</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Error general */}
        {errors.general && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px'
          }}>
            {errors.general}
          </div>
        )}

        {/* Campo Nombre */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre de la Medida *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ej: Kilogramos, Metros, Litros..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: errors.name ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {errors.name}
            </span>
          )}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: isSubmitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isSubmitting 
              ? (measureToEdit ? 'Actualizando...' : 'Creando...') 
              : (measureToEdit ? 'Actualizar' : 'Crear')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeasureForm;
