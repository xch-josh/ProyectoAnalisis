import React from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

export default function Layout({logOut}) {
  return (
    <div className='mainUI'>
      <NavBar />
      <Header logOut={logOut} />
      <main className='Content overflow-auto'>
        <Outlet />
      </main>
    </div>
  )
}
