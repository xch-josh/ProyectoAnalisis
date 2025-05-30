import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import logo from '../../images/Logo.png';
import { GetAccess } from '../../API_Service/Rol';

export default function NavBar() {
  const [accessList, setAccessList] = useState([]);

  useEffect(() => {
    async function loadAccess() {
      try {
        const rolID = sessionStorage.getItem("rolID");
        if (rolID) {
          const data = await GetAccess(rolID);
          console.log("API Response:", data, "Type:", typeof data); // Para debugging
          
          // Manejar diferentes tipos de respuesta
          if (Array.isArray(data)) {
            setAccessList(data);
          } else if (data && Array.isArray(data.data)) {
            // Si la respuesta viene envuelta en un objeto
            setAccessList(data.data);
          } else {
            console.warn("API no devolvió un array:", data);
            setAccessList([]);
          }
        }
      } catch (error) {
        console.error("Error loading access:", error);
        setAccessList([]);
      }
    }

    loadAccess();
  }, []);

  // Función para obtener y ordenar los módulos padre
  const getSortedParentModules = () => {
    return accessList
      .filter(mod => mod.father === null) // Solo módulos padre
      .sort((a, b) => a.moduleName.localeCompare(b.moduleName)); // Ordenar alfabéticamente
  };

  return (
    <nav className='NavBar px-1'>
      <div className='col'>
        <div className='text-center'>
          <img src={logo} alt="logo" className='logo' />
        </div>
        <div>
          {accessList && accessList.length > 0 ? (
            getSortedParentModules().map(mod => {
              if (!mod.link) {
                // Módulo padre con hijos - también ordenar los hijos alfabéticamente
                const childMods = accessList
                  .filter(child => child.father === mod.moduleID)
                  .sort((a, b) => a.moduleName.localeCompare(b.moduleName));
                
                return (
                  <div key={mod.moduleID}>
                    <button
                      type='button'
                      className='menuButton btn w-100 mb-0 text-start outline-none'
                      data-bs-toggle='collapse'
                      data-bs-target={`#collapse${mod.moduleID}`}
                      aria-expanded='false'
                      aria-controls={`collapse${mod.moduleID}`}
                    >
                      <i className={mod.icon}></i> {mod.moduleName}
                    </button>
                    <div className='collapse' id={`collapse${mod.moduleID}`}>
                      <div>
                        {childMods.map(child => (
                          <Link
                            key={child.moduleID}
                            to={child.link}
                            className='menuButton btn w-100 mb-1 text-start ps-4 outline-none'
                          >
                            <i className={child.icon}></i> {child.moduleName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Módulo padre directo (con link)
              return (
                <Link
                  key={mod.moduleID}
                  to={mod.link}
                  className='menuButton btn w-100 mb-1 text-start outline-none'
                >
                  <i className={mod.icon}></i> {mod.moduleName}
                </Link>
              );
            })
          ) : (
            <div className="text-center p-3 text-muted">
              No hay menús disponibles
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}