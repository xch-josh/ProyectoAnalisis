import React, { useEffect, useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'

export default function EditRolView({ onSave, rolState, rolData }) {
    const RolID= rolData.rolId;
    const [Name, setName] = useState(rolData?.name || '');

    useEffect(() => {
        if (rolData) {
            setName(rolData.name || '');
        }
    }, [rolData]);

    const editRol = () => {
        if (Name.trim() !== '') {
            const data = {
                rolId: RolID,
                name: Name,
                state: rolState
            }

            onSave(data);
        }
        else {
            SweetAlert.ShowMessage('Debe llenar todos los campos', 'Error', 'error');
        }
    };

    return (
        <div className="modal fade" id="modalEdit" data-bs-backdrop="static" tabIndex="-2" aria-labelledby="editTitle" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title" id="editTitle">Editar rol</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 ">
                        <div className='row mx-3 my-2'>
                            <div className='mb-2'>
                                <label >Nombre del rol: </label>
                                <input type="text" className='form-control' onChange={(e) => setName(e.target.value)} value={Name} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer bg-light">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-theme-primary" onClick={editRol}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
