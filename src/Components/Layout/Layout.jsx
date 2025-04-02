import React from 'react'
import Header from './Header'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='mainUI'>
      <NavBar />
      <Header />
      <main className='Content'>
        <Outlet />
      </main>
    </div>
  )
}
