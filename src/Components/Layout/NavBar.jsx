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
          <button type='button' className='menuButton btn w-100 mb-0 text-start' data-bs-toggle="collapse" data-bs-target="#collapseAdministration" aria-expanded="false" aria-controls="collapseAdministration"><i className="bi bi-gear"></i> Administración</button>
          <div className="collapse" id="collapseAdministration">
            <div>
              <Link to="/Users" className='menuButton btn w-100 mb-1 text-start ps-4'><i className="bi bi-person-check"></i> Usuarios</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
