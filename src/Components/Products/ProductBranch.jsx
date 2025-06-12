import React, { useEffect, useState } from 'react'
import SweetAlert2 from '../../SweetAlert2';
import ProductAPIService from '../../API_Services/ProductAPIService';
import { useNavigate, useParams } from 'react-router-dom'

export default function ProductBranch() {
  const { productId } = useParams();
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (productId) {
        try {
          setLoading(true);
          
          // Obtener la configuración del producto en sucursales (ya viene procesado)
          const productBranches = await ProductAPIService.GetProductBranches(productId);

          setBranchData(productBranches || []);
          
        } catch (error) {
          console.error("Error loading data:", error);
          SweetAlert2.ShowMessage('Error al cargar los datos', 'Error', 'error');
          setBranchData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [productId]);

  // Función para manejar cambio de disponibilidad
  const handleAvailabilityChange = (branchID, enabled) => {
    setBranchData(prevData =>
      prevData.map(item =>
        item.branchID === branchID
          ? { 
              ...item, 
              enable: enabled,
              // Si se deshabilita, resetear cantidad a 0
              stock: enabled ? item.stock : 0
            }
          : item
      )
    );
  };

  // Función para manejar cambio de cantidad
  const handleQuantityChange = (branchID, value) => {
    const numericValue = parseInt(value) || 0;
    
    setBranchData(prevData =>
      prevData.map(item =>
        item.branchID === branchID
          ? { ...item, stock: numericValue }
          : item
      )
    );
  };

  // Función para validar los datos antes de guardar
  const validateData = () => {
    const enabledBranches = branchData.filter(branch => branch.enable);
    
    if (enabledBranches.length === 0) {
      SweetAlert2.ShowMessage('Debe seleccionar al menos una sucursal', 'Validación', 'warning');
      return false;
    }

    // Validar que las sucursales habilitadas tengan cantidad >= 0
    const invalidBranches = enabledBranches.filter(branch => branch.stock < 0);
    if (invalidBranches.length > 0) {
      SweetAlert2.ShowMessage('La cantidad en existencia no puede ser negativa', 'Validación', 'warning');
      return false;
    }

    return true;
  };

  const onSaveHandle = async () => {
    if (!validateData()) {
      return;
    }

    try {
      const result = await ProductAPIService.UpdateProductBranches(productId, branchData);

      if (result === true) {
        SweetAlert2.ShowMessage('Configuración actualizada correctamente', 'Hecho', 'success');
        navigate('/Products');
      } else {
        SweetAlert2.ShowMessage('Error al actualizar la configuración', 'Error', 'error');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      SweetAlert2.ShowMessage('Error al guardar los cambios', 'Error', 'error');
    }
  };

  const getTotalStock = () => {
    return branchData
      .filter(branch => branch.enable)
      .reduce((total, branch) => total + branch.stock, 0);
  };

  const getEnabledBranchesCount = () => {
    return branchData.filter(branch => branch.enable).length;
  };

  if (loading) {
    return (
      <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando configuración de sucursales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-100 h-100 p-3'>
      <div className='row'>
        {/* Header */}
        <div className='mb-4'>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h3 className='mb-1'>Configuración de Sucursales</h3>
            </div>
          </div>
          <hr className='my-3' />
        </div>

        {/* Tabla de configuración */}
        <div className='col-12'>
          <div className='tableContainer overflow-auto'>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" className='bg-theme-primary text-center'>Habilitado</th>
                  <th scope="col" className='bg-theme-primary'>Sucursal</th>
                  <th scope="col" className='bg-theme-primary text-center'>Stock</th>
                </tr>
              </thead>
              <tbody>
                {branchData.map((branch) => (
                  <tr key={branch.branchID}>
                    {/* Checkbox de habilitación */}
                    <td className='text-center'>
                      <input
                        type="checkbox"
                        checked={branch.enable}
                        onChange={(e) => handleAvailabilityChange(branch.branchID, e.target.checked)}
                        className="form-check-input"
                      />
                    </td>

                    {/* Información de sucursal */}
                    <td>
                      <span className='fw-bold'>{branch.branchName}</span>
                    </td>

                    {/* Stock */}
                    <td className='text-center'>
                      <input
                        type="number"
                        className='form-control form-control-sm text-center'
                        style={{ maxWidth: '120px', margin: '0 auto' }}
                        value={branch.stock}
                        onChange={(e) => handleQuantityChange(branch.branchID, e.target.value)}
                        disabled={!branch.enable}
                        min="0"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen y acciones */}
        <div className='col-12 mt-4'>
          <div className='row'>
            {/* Cards de resumen */}
            <div className='col-md-8'>
              <div className='row'>
                <div className='col-md-4'>
                  <div className='card text-center'>
                    <div className='card-body'>
                      <h5 className='card-title text-primary'>{getEnabledBranchesCount()}</h5>
                      <p className='card-text small text-muted'>Sucursales Habilitadas</p>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card text-center'>
                    <div className='card-body'>
                      <h5 className='card-title text-success'>{getTotalStock()}</h5>
                      <p className='card-text small text-muted'>Stock Total</p>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card text-center'>
                    <div className='card-body'>
                      <h5 className='card-title text-info'>{branchData.length}</h5>
                      <p className='card-text small text-muted'>Total Sucursales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className='col-md-4 d-flex align-items-end justify-content-end'>
              <div className='d-flex gap-2'>
                <button 
                  type='button' 
                  className='btn btn-theme-primary btn-sm'
                  onClick={onSaveHandle}
                  disabled={getEnabledBranchesCount() === 0}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}