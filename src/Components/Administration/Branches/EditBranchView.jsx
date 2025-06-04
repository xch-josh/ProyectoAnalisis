import React, { useEffect, useState } from 'react'
import SweetAlert from '../../../SweetAlert2.js'

export default function EditBranchView({ onSave, branchState, branchData }) {
    const RolID= branchData.branchId;
    const [Name, setName] = useState(branchData?.name || '');
    const [Direction, setDirection] = useState(branchData?.direction || '');

    useEffect(() => {
        if (branchData) {
            setName(branchData.name || '');
            setDirection(branchData.direction || '');
        }
    }, [branchData]);

    const editRol = () => {
        if (Name.trim() !== '') {
            const data = {
                branchId: RolID,
                name: Name,
                direction: Direction,
                state: branchState
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
                        <h5 className="modal-title" id="editTitle">Editar sucursal</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 ">
                        <div className='row mx-3 my-2'>
                            <div className='mb-2'>
                                <label >Nombre de sucursal: </label>
                                <input type="text" className='form-control' onChange={(e) => setName(e.target.value)} value={Name} />
                            </div>
                        </div>
                        <div className='row mx-3 my-2'>
                            <div className='mb-2'>
                                <label >Dirección: </label>
                                <input type="text" className='form-control' onChange={(e) => setDirection(e.target.value)} value={Direction} />
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
