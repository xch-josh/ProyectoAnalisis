import React from 'react'
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className='NavBar px-1'>
      <div className='col'>
        <div className='text-center'>
          <h1>Logo</h1>
        </div>
        <div>
          <Link to="/Users" className='menuButton btn w-100 mb-1 text-start'><i class="bi bi-gear"></i> Usuarios</Link>
        </div>
      </div>
    </nav>
  )
}
