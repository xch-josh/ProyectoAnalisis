import React, { useEffect, useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'
import { GetModuleAccess, UpdateModuleAccess } from '../../../API_Service/Rol'
import { useNavigate, useParams } from 'react-router-dom'

export default function RolAccessView() {
  const { rolId } = useParams();
  const [accessData, setAccessData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccessData = async () => {
      if (rolId) {
        try {
          const data = await GetModuleAccess(rolId);
          setAccessData(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error loading access data:", error);
          setAccessData([]);
        }
      }
    };

    loadAccessData();
  }, [rolId]);

  // Función para organizar los datos jerárquicamente
  const organizeHierarchicalData = (data) => {
    const organized = [];

    // Primero agregamos los padres (father === null)
    const parents = data.filter(item => item.father === null);

    parents.forEach(parent => {
      // Agregamos el padre
      organized.push({
        ...parent,
        isParent: true,
        level: 0
      });

      // Agregamos sus hijos
      const children = data.filter(item => item.father === parent.moduleID);
      children.forEach(child => {
        organized.push({
          ...child,
          isParent: false,
          level: 1
        });
      });
    });

    return organized;
  };

  // Función para manejar el cambio de checkbox
  const handleCheckboxChange = (moduleID, checked) => {
    setAccessData(prevData =>
      prevData.map(item =>
        item.moduleID === moduleID
          ? { ...item, enableAccess: checked }
          : item
      )
    );
  };

  // Obtener datos organizados
  const organizedData = organizeHierarchicalData(accessData);

  const onSaveHandle = async () => {
    const result = await UpdateModuleAccess(rolId, accessData);

    if (result === true){
      SweetAlert.ShowMessage('Accesos actualizados correctamente', 'Hecho', 'success');
      navigate('/Roles')
    }
  };

  return (
    <div className='w-100 h-100'>
      <form>
        <div className='row'>
          <div className='mb-5'>
            <h3 className='mb-0'>Accesos del rol</h3>
            <hr className='my-0' />
          </div>
          <div className='tableContainer overflow-auto'>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" className='bg-theme-primary col-md-1'>Selección</th>
                  <th scope='col' className='bg-theme-primary'>Módulo</th>
                </tr>
              </thead>
              <tbody>
                {organizedData.map((item) => (
                  <tr
                    key={item.moduleID}
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
                          onChange={(e) => handleCheckboxChange(item.moduleID, e.target.checked)}
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
                          {item.moduleName}
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