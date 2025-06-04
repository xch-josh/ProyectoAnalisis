import React, { useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'

export default function AddUserView({onSave, roles}) {
    const [Name, setName] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [RolID, setRolID] = useState(1);

    const saveUser = () => {
        if(Name.trim() !== '' && Username.trim() !== '' && Password.trim() !== ''){
            const data = {
                name : Name,
                username : Username,
                password : Password,
                rolId : parseInt(RolID),
                state : true
            }
    
            onSave(data);
        }
        else{
            SweetAlert.ShowMessage('Debe llenar todos los campos', 'Error', 'error');
        }
    };

    return (
        <div className="modal fade" id="modalAdd" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="addTitle" aria-hidden="true" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title" id="addTitle">Agregar usuario</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 ">
                        <div className='row mx-3 my-2'>
                            <div className='mb-2'>
                                <label >Nombre completo: </label>
                                <input type="text" className='form-control' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mb-2'>
                                <label >Nombre de usuario: </label>
                                <input type="text" className='form-control' onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className='mb-2'>
                                <label >Contraseña: </label>
                                <input type="password" className='form-control' onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className='mb-2'>
                                <label >Rol: </label>
                                <select className='form-select' onChange={(e) => setRolID(e.target.value)}>
                                    {
                                        roles.map(rol => {
                                            return (
                                                <option key={rol.rolId} value={rol.rolId}>{rol.name}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer bg-light">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-theme-primary" onClick={saveUser}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
