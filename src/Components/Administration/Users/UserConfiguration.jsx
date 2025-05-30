import React, { useEffect, useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'
import { useNavigate, useParams } from 'react-router-dom'
import { GetBranchAccess, UpdateBranchAccess } from '../../../API_Service/User.js';

export default function UserConfiguration() {
  const { userId } = useParams();
  const [accessData, setAccessData] = useState([]);
  const navigate = useNavigate();

  // ❌ INCORRECTO - No uses async directamente en useEffect
  // useEffect(async () => {

  // ✅ CORRECTO - Define una función async dentro del useEffect
  useEffect(() => {
    const loadAccessData = async () => {
      console.log("ususario: " + userId);
      if (userId) {
        try {
          const data = await GetBranchAccess(userId);
          setAccessData(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error loading access data:", error);
          setAccessData([]);
        }
      }
    };

    loadAccessData();
  }, [userId]);

  // Función para manejar el cambio de checkbox
  const handleCheckboxChange = (branchID, checked) => {
    setAccessData(prevData =>
      prevData.map(item =>
        item.branchID === branchID
          ? { ...item, enableAccess: checked }
          : item
      )
    );
  };


  const onSaveHandle = async () => {
    const result = await UpdateBranchAccess(userId, accessData);

    if (result === true){
      SweetAlert.ShowMessage('Accesos actualizados correctamente', 'Hecho', 'success');
      navigate('/Users')
    }
  };

  return (
    <div className='w-100 h-100'>
      <form>
        <div className='row'>
          <div className='mb-5'>
            <h3 className='mb-0'>Sucursales del usuario</h3>
            <hr className='my-0' />
          </div>
          <div className='tableContainer overflow-auto'>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" className='bg-theme-primary col-md-1'>Selección</th>
                  <th scope='col' className='bg-theme-primary'>Sucursal</th>
                </tr>
              </thead>
              <tbody>
                {accessData.map((item) => (
                  <tr
                    key={item.branchID}
                    className={item.isParent ? 'fw-bold' : ''}
                    style={{
                      backgroundColor: item.isParent ? '#f8f9fa' : 'transparent'
                    }}
                  >
                    <td>
                      <span className='my-auto'>
                        <input
                          type="checkbox"
                          checked={item.enableAccess}
                          onChange={(e) => handleCheckboxChange(item.branchID, e.target.checked)}
                          className="form-check-input"
                        />
                      </span>
                    </td>
                    <td>
                      <span
                        className='my-auto d-flex align-items-center'
                        style={{
                          paddingLeft: `${item.level * 25}px`
                        }}
                      >
                        {item.level > 0 && (
                          <span className="text-muted me-2">├─</span>
                        )}
                        <span className={item.isParent ? 'fw-bold' : ''}>
                          {item.branchName}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-end col-md-12 mb-1'>
            <button type='button' id='btnAdd' className='btn btn-theme-primary btn-sm outline-none' onClick={onSaveHandle}>Guardar cambios</button>
          </div>
        </div>
      </form>
    </div>
  )
}
