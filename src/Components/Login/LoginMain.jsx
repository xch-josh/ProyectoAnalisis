import React from 'react'
import LoginMainView from './LoginMainView'
import {BeginSession} from '../../API_Service/User.js'
import SweetAlert from '../../SweetAlert2.js'

export default function LoginMain() {
  const Session = (user, pass) => {
    let result = BeginSession(user, pass);

    if (result){
      SweetAlert.ShowMessage("Inicio sesion", "Sesion", "success");
    }
  };

  return (
    <div>
        <LoginMainView onSubmit={Session()} />
    </div>
  )
}
