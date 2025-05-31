import React, { useEffect, useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'
import RolMainView from './RolMainView';
import { GetRol, GetRoles, Insert, Edit, Delete } from '../../../API_Service/Rol.js';

export default function RolMain() {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {//CARGAR TODOS LOS REGISTROS
    async function onLoadHandle() {
      const data = await GetRoles();
      setData(data);
    }
  
    onLoadHandle();
  }, [reload]);
  
  const onGetHandle = async (id) => {//OBTENER UN REGISTRO
    let result = await GetRol(id);

    if(result !== false){
      return result;
    }
  }
  
  const onSaveHandle = async (data) => {//GUARDAR DATOS
    let result = await Insert(data);

    if(result === true) {
      SweetAlert.ShowMessage('Datos guardados correctamente', 'Hecho', 'success');

      window.bootstrap.Modal.getInstance(document.getElementById('modalAdd')).hide();
      document.querySelector('.modal-backdrop').remove();

      setReload(!reload);
    }
  }

  const onEditHandle = async (data) => {//EDITAR DATOS
    let result = await Edit(data);

    if(result === true) {
      SweetAlert.ShowMessage('Datos actualizados correctamente', 'Hecho', 'success');

      window.bootstrap.Modal.getInstance(document.getElementById('modalEdit')).hide();
      document.querySelector('.modal-backdrop').remove();

      setReload(!reload);
    }
  }
  
  const onDeleteHandle = async (id) => {//ELIMINAR UN REGISTRO
    let result = await SweetAlert.ShowMessage('¿Desea eliminar el registro?', 'Eliminar datos', 'question');
    
    if (result === true){
      let res = await Delete(id);

      if(res === true){
        setReload(!reload);
      }
    }
  };

  return (
    <RolMainView data={data} onGet={onGetHandle} onSave={onSaveHandle} onEdit={onEditHandle} onDelete={onDeleteHandle}/>
  )
}
