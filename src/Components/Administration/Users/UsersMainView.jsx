import React from 'react'

export default function UsersMainView() {
    return (
        <form autoComplete='off'>
            <div className='w-100 h-100'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Usuarios</h3>
                        <hr className='my-0' />
                    </div>
                    <div className='row mt-4 mb-2 col-sm-12 mx-auto'>                        <div className='d-flex justify-content-start col-md-4'>
                            <div className='col-md-1 d-flex justify-content-center align-content-center'>
                                <i className="bi bi-search my-auto"></i>
                            </div>
                            <div className='col-md-9 px-0'>
                                <input type="text" id="txtSearch" className='form-control form-control-sm ' placeholder='Buscar' />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end col-md-8 mb-1'>
                            <button type='button' className='btn btn-primary btn-sm'><span className='mx-2'><i className="bi bi-plus-lg"></i> Nuevo</span></button>
                        </div>
                    </div>
                    <div>
                        <table className="table table-hover bg-theme-primary">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Handle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td colspan="2">Larry the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </form>
    )
}
