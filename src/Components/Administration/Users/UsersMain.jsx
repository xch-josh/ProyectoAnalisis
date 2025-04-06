import React from 'react'
import UsersMainView from './UsersMainView'
import SweetAlert from '../../../SweetAlert2.js'

async function Delete(){
    let result = await SweetAlert.ShowMessage("¿Desea eliminar el registro?", "Eliminar registro", "question");

    if (result) {
      SweetAlert.ShowMessage("Registro eliminado correctamente", "Eliminar registro", "success")
    }
}

async function Save() {
  SweetAlert.ShowMessage("Registro guardado correctamente", "Guardar registro", "success")
}

async function Edit() {
  SweetAlert.ShowMessage("Registro editado correctamente", "Editar registro", "success")
}

export default function UsersMain() {
  return (
    <UsersMainView onDelete={Delete} />
  )
}
