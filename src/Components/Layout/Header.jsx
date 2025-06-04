import React from 'react'

export default function Header({logOut}) {

  const onCloseSessionHandle = () => {
    logOut();
  };

  return (
    <header className='Header'>
      <div className='px-3 w-100 d-flex justify-content-end'>
        <button className='btn btn-theme-aux mt-2 outline-none' onClick={onCloseSessionHandle}>Cerrar sesión</button>
      </div>
    </header>
  )
}
