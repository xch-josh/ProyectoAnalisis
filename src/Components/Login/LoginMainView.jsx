import React, { useState } from 'react'
import logo from '../../images/Logo.png';
import {BeginSession} from '../../API_Service/User.js'
import SweetAlert from '../../SweetAlert2.js'

export default function LoginMainView({ onSubmit }) {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const handleSession = async (e) => {
        e.preventDefault();

        let result = await BeginSession(user, password);
        
        if (result === true){
            
            onSubmit();
        }
        else{
            SweetAlert.ShowMessage("El usuario o contraseña son incorrectos", "Error", "error");
        }
    };

    return (
        <div className='w-100 vh-100 bg-light'>
            <div className='row w-100 h-100 bg-light d-flex justify-content-center align-items-center'>
                <div className='card px-4 py-3 shadow bg-light login'>
                    <form onSubmit={handleSession}>
                        <div className='text-center'>
                            <h3>Iniciar sesión</h3>
                            <img src={logo} alt="logo" className='logo' />
                        </div>
                        <div className='col-md-12 mb-3'>
                            <input className='form-control' value={user} onChange={e => setUser(e.target.value)} type="text" placeholder='Usuario' autoFocus required autoComplete='off' />
                        </div>
                        <div className='col-md-12 mb-3'>
                            <input className='form-control' value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='Contraseña' required />
                        </div>
                        <div className='col-md-12'>
                            <button type='submit' className='btn btn-theme-tertiary w-100'>Entrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
