import React, { useEffect, useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'

export default function EditUserView({ onSave, roles, userState, userData }) {
    const UserID = userData.userId;
    const [Name, setName] = useState(userData?.name || '');
    const [Username, setUsername] = useState(userData?.userName || '');
    const [Password, setPassword] = useState(userData?.password || '');
    const [RolID, setRolID] = useState(userData?.rolId || 1);

    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setUsername(userData.userName || '');
            setPassword(userData.password || '');
            setRolID(userData.rolId || 1);
        }
    }, [userData]);

    const editUser = () => {
        if(Name.trim() !== '' && Username.trim() !== '' && Password.trim() !== ''){
            const data = {
                userID : UserID,
                name : Name,
                username : Username,
                password : Password,
                rolId : parseInt(RolID),
                state : userState
            }
    
            onSave(data);
        }
        else{
            SweetAlert.ShowMessage('Debe llenar todos los campos', 'Error', 'error');
        }
    };

    return (
        <div className="modal fade" id="modalEdit" data-bs-backdrop="static" tabIndex="-2" aria-labelledby="editTitle" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title" id="editTitle">Editar usuario</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 ">
                        <div className='row mx-3 my-2'>
                            <div className='mb-2'>
                                <label >Nombre completo: </label>
                                <input type="text" className='form-control' onChange={(e) => setName(e.target.value)} value={Name} />
                            </div>
                            <div className='mb-2'>
                                <label >Nombre de usuario: </label>
                                <input type="text" className='form-control' onChange={(e) => setUsername(e.target.value)} value={Username} />
                            </div>
                            <div className='mb-2'>
                                <label >Contraseña: </label>
                                <input type="password" className='form-control' onChange={(e) => setPassword(e.target.value)} value={Password} />
                            </div>
                            <div className='mb-2'>
                                <label >Rol: </label>
                                <select className='form-select' onChange={(e) => setRolID(e.target.value)} value={RolID}>
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
                        <button type="button" className="btn btn-theme-primary" onClick={editUser}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
