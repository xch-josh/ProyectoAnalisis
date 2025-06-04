import React, { useState, useEffect } from 'react';
import MeasureService from './MeasureService';
import MeasureForm from './MeasureForm';

const MeasuresMainView = () => {
  const [measures, setMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMeasure, setEditingMeasure] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar medidas
  const loadMeasures = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await MeasureService.getAllMeasures();
      setMeasures(data);
    } catch (err) {
      setError('Error al cargar las medidas: ' + err.message);
      console.error('Error cargando medidas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar medidas al montar el componente
  useEffect(() => {
    loadMeasures();
  }, []);

  // Mostrar formulario para crear nueva medida
  const handleNewMeasure = () => {
    setEditingMeasure(null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  // Mostrar formulario para editar medida
  const handleEditMeasure = (measure) => {
    setEditingMeasure(measure);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  // Eliminar medida
  const handleDeleteMeasure = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta medida?')) {
      return;
    }

    try {
      await MeasureService.deleteMeasure(id);
      setSuccessMessage('Medida eliminada exitosamente');
      loadMeasures(); // Recargar la lista
    } catch (err) {
      setError('Error al eliminar la medida: ' + err.message);
      console.error('Error eliminando medida:', err);
    }
  };

  // Manejar guardado exitoso
  const handleSaveSuccess = () => {
    setShowForm(false);
    setEditingMeasure(null);
    setSuccessMessage(editingMeasure ? 'Medida actualizada exitosamente' : 'Medida creada exitosamente');
    loadMeasures(); // Recargar la lista
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMeasure(null);
    setError('');
  };

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (showForm) {
    return (
      <MeasureForm
        measureToEdit={editingMeasure}
        onSave={handleSaveSuccess}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gestión de Medidas</h2>
        <button
          onClick={handleNewMeasure}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Nueva Medida
        </button>
      </div>

      {/* Mensajes */}
      {successMessage && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '5px'
        }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Cargando medidas...</p>
        </div>
      )}

      {/* Lista de medidas */}
      {!loading && (
        <div>
          {measures.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              color: '#6c757d'
            }}>
              <p>No hay medidas registradas</p>
              <button
                onClick={handleNewMeasure}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '10px'
                }}
              >
                Crear primera medida
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '15px'
            }}>
              {measures.map((measure) => (
                <div
                  key={measure.measureId}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                      {measure.name}
                    </h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>
                      ID: {measure.measureId}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleEditMeasure(measure)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMeasure(measure.measureId)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Información adicional */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <p><strong>Total de medidas:</strong> {measures.length}</p>
        <p><strong>Nota:</strong> Las medidas son utilizadas para definir las unidades de los productos (kg, m, l, etc.)</p>
      </div>
    </div>
  );
};

export default MeasuresMainView;
