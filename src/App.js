import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Layout from "./Components/Layout/Layout";
import UsersMain from "./Components/Administration/Users/UsersMain";
import RolMain from "./Components/Administration/Roles/RolMain";
import RolAccessView from "./Components/Administration/Roles/RolAccessView";
import BranchMain from "./Components/Administration/Branches/BranchMain";
import LoginMainView from "./Components/Login/LoginMainView";
import UserConfiguration from "./Components/Administration/Users/UserConfiguration";
import SelectBranch from "./Components/Administration/Branches/SelectBranch";

import React, { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [branchSelected, setBranchSelected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const userName = sessionStorage.getItem("userName");
    const userId = sessionStorage.getItem("userId"); // Asegúrate de guardar el userId en el login
    const branchId = sessionStorage.getItem("branchId");
    
    if (userName) {
      setIsAuthenticated(true);
      setCurrentUserId(userId);
    }
    if (branchId) {
      setBranchSelected(true);
    }
  }, []);

  const onLoginHandle = () => {
    setIsAuthenticated(true);
  };

  const onBranchSelect = () => {
    setBranchSelected(true);
  };

  const onLogOutHandle = () => {
    // Limpiar datos de sesión
    sessionStorage.clear();
    localStorage.clear();
    
    // Limpiar estados
    setIsAuthenticated(false);
    setBranchSelected(false);
    setCurrentUserId(null);
    
    // Limpiar el historial de la pestaña
    clearBrowserHistory();
  };

  const clearBrowserHistory = () => {
    try {
      // Método 1: Reemplazar toda la pila del historial
      const historyLength = window.history.length;
      
      // Ir al inicio del historial
      window.history.go(-historyLength);
      
      // Pequeño delay para asegurar que se ejecute
      setTimeout(() => {
        // Reemplazar la entrada actual con la página de login
        window.history.replaceState(null, null, '/');
        
        // Forzar recarga para limpiar completamente el estado
        window.location.replace('/');
      }, 100);
      
    } catch (error) {
      console.error('Error limpiando historial:', error);
      // Fallback: forzar redirección
      window.location.replace('/');
    }
  };

  // Prevenir navegación hacia atrás después del logout
  useEffect(() => {
    if (!isAuthenticated && !sessionStorage.getItem("userName")) {
      const preventBack = (event) => {
        // Prevenir navegación hacia atrás
        window.history.pushState(null, null, window.location.pathname);
      };

      // Agregar estado inicial para prevenir navegación
      window.history.pushState(null, null, window.location.pathname);
      
      // Escuchar eventos de navegación
      window.addEventListener('popstate', preventBack);

      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [isAuthenticated]);
  
  return (
    <div className="w-100 vh-100">
      <Router>
        <Routes>
          {/* Rutas para usuarios NO autenticados */}
          {!isAuthenticated && !sessionStorage.getItem("userName") && (
            <Route path="*" element={<LoginMainView onSubmit={onLoginHandle} />} />
          )}

          {/* Rutas para usuarios autenticados SIN sucursal seleccionada */}
          {(isAuthenticated || sessionStorage.getItem("userName")) && 
           (!branchSelected && !sessionStorage.getItem("branchId")) && (
            <>
              <Route 
                path="/SelectBranch/:userId" 
                element={<SelectBranch onSelect={onBranchSelect} notBranchesHandle={() => onLogOutHandle()} />} 
              />
              {/* Redirigir cualquier otra ruta a SelectBranch */}
              <Route 
                path="*" 
                element={<Navigate to={`/SelectBranch/${currentUserId || sessionStorage.getItem("userId") || "1"}`} replace />} 
              />
            </>
          )}

          {/* Rutas para usuarios autenticados CON sucursal seleccionada */}
          {(isAuthenticated || sessionStorage.getItem("userName")) && 
           (branchSelected || sessionStorage.getItem("branchId")) && (
            <>
              <Route path="/" element={<Layout logOut={onLogOutHandle} />}>
                <Route index element={<Navigate to="/" replace />} />
                <Route path="/Users" element={<UsersMain/>} />
                <Route path="/Roles" element={<RolMain/>} />
                <Route path="/RolAccess/:rolId" element={<RolAccessView/>} />
                <Route path="/Branches" element={<BranchMain />} />
                <Route path="/UserConf/:userId" element={<UserConfiguration />} />
              </Route>
              {/* Mantener acceso a SelectBranch por si quieren cambiar de sucursal */}
              <Route 
                path="/SelectBranch/:userId" 
                element={<SelectBranch onSelect={onBranchSelect} />} 
              />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;