import React from 'react'

export default function AddUserView() {
    return (
        <div className='row mx-3 my-2'>
            <div className='mb-2'>
                <label htmlFor="txtName">Nombre completo: </label>
                <input type="text" id='txtName' className='form-control' />
            </div>
            <div className='mb-2'>
                <label htmlFor="txtPass">Nombre de usuario: </label>
                <input type="text" id='txtUser' className='form-control' />
            </div>
            <div className='mb-2'>
                <label htmlFor="txtPass">Contraseña: </label>
                <input type="password" id='txtPass' className='form-control' />
            </div>
        </div>
    )
}
