import React, { useState } from 'react'
import NoPhoto from '../../images/NoPhoto.png'

export default function Header({ logOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Obtener datos del usuario desde sessionStorage
  const userData = {
    name: sessionStorage.getItem("name") || "Usuario",
    email: sessionStorage.getItem("userEmail") || "usuario@empresa.com",
    role: sessionStorage.getItem("rol") || "Usuario",
    branch: sessionStorage.getItem("branchName") || "Sucursal",
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const onCloseSessionHandle = () => {
    setIsDropdownOpen(false)
    logOut();
  };

  const onChangeBranchHandle = () => {
    setIsDropdownOpen(false)
    // Redirigir a SelectBranch manteniendo el userId
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      window.location.href = `/SelectBranch/${userId}`;
    }
  }

  return (
    <>
      <header className="Header">
        <div className='row w-100'>
          <div className='col ms-3 text-muted fw-bold'>
            <div className="fs-2">
              <i className="bi bi-building me-1"></i>
              {userData.branch}
            </div>
          </div>
          <div className="col px-3 w-100 d-flex justify-content-end">
            <div className="dropdown">
              <button
                className="btn mt-1 d-flex align-items-center gap-2 outline-none"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={NoPhoto}
                    alt={userData.name}
                    className="rounded-circle"
                    width="32"
                    height="32"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="d-none d-md-block text-start">
                    <div className="fw-semibold" style={{ fontSize: "0.875rem", lineHeight: "1.2" }}>
                      {userData.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.75rem", lineHeight: "1" }}>
                      {userData.role}
                    </div>
                  </div>
                </div>
                <i
                  className="bi bi-chevron-down"
                  style={{
                    transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                ></i>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="dropdown-backdrop"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                  <div
                    className="dropdown-menu show position-absolute"
                    style={{
                      right: 0,
                      top: "100%",
                      minWidth: "280px",
                      zIndex: 1000,
                      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                      border: "1px solid rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {/* User Info Section */}
                    <div className="px-3 py-3 border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={NoPhoto}
                          alt={userData.name}
                          className="rounded-circle"
                          width="48"
                          height="48"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold mb-1">{userData.name}</div>
                          <div className="small">
                            <span className="badge bg-secondary">{userData.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="py-1">
                      <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={onChangeBranchHandle}>
                        <i className="bi bi-building"></i>
                        <span>Cambiar de sucursal</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                        onClick={onCloseSessionHandle}
                      >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .dropdown {
          position: relative;
        }
        
        .dropdown-item {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 0.5rem 1rem;
          color: inherit;
          text-decoration: none;
          display: block;
          clear: both;
          font-weight: 400;
          white-space: nowrap;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .dropdown-item.text-danger:hover {
          background-color: #f8d7da;
          color: #721c24 !important;
        }
        
        .gap-2 {
          gap: 0.5rem;
        }
        
        .gap-3 {
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .dropdown-menu {
            min-width: 260px !important;
            right: 0 !important;
            left: auto !important;
          }
        }
      `}</style>
    </>
  )
}