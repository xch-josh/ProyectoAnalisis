import React from 'react'
import AddUserView from './AddUserView'

export default function UsersMainView({onDelete}) {
    return (
        <form autoComplete='off'>
            <div className='w-100 h-100'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Usuarios</h3>
                        <hr className='my-0' />
                    </div>
                    <div className='row mt-4 mb-2 col-sm-12 mx-auto'>
                        <div className='d-flex justify-content-start col-md-4'>
                            <div className='col-md-1 d-flex justify-content-center align-content-center'>
                                <i className="bi bi-search my-auto"></i>
                            </div>
                            <div className='col-md-9 px-0'>
                                <input type="text" id="txtSearch" className='form-control form-control-sm ' placeholder='Buscar' />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end col-md-8 mb-1'>
                            <button type='button' id='btnAdd' className='btn btn-theme-primary btn-sm' data-bs-toggle="modal" data-bs-target="#modalAdd"><span className='mx-2'><i className="bi bi-plus-lg"></i> Nuevo</span></button>
                        </div>
                    </div>
                    <div className='tableContainer overflow-auto'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" className='bg-theme-primary'>Nombre completo</th>
                                    <th scope="col" className='bg-theme-primary'>Nombre de usuario</th>
                                    <th scope="col" className='bg-theme-primary'>Estado</th>
                                    <th scope="col" className='bg-theme-primary'>Rol</th>
                                    <th scope='col' className='bg-theme-primary'></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <th><span className='my-auto'>Danny Josué Xicay Chicol</span></th>
                                    <td>xch_josh</td>
                                    <td><span>Activo</span></td>
                                    <td>Administrador</td>
                                    <td>
                                        <button type='button' className='btn btn-sm btn-theme-seccondary me-1'><i className="bi bi-pencil-square"></i></button>
                                        <button type='button' className='btn btn-sm btn-theme-danger' onClick={onDelete}><i className="bi bi-trash3"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalAdd" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h5 className="modal-title" id="exampleModalLabel">Agregar usuario</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-0 ">
                            <AddUserView />
                        </div>
                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-theme-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
