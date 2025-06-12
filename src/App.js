import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Layout from "./Components/Layout/Layout";

//DANNY
import UsersMain from "./Components/Administration/Users/UsersMain";
import RolMain from "./Components/Administration/Roles/RolMain";
import RolAccessView from "./Components/Administration/Roles/RolAccessView";
import BranchMain from "./Components/Administration/Branches/BranchMain";
import LoginMainView from "./Components/Login/LoginMainView";
import UserConfiguration from "./Components/Administration/Users/UserConfiguration";
import SelectBranch from "./Components/Administration/Branches/SelectBranch";
import ProductBranch from "./Components/Products/ProductBranch";

//PABLO
import ClientsMainView from "./Components/Administration/Clients/ClientsMainView";
import { CartProvider } from "./context/CartContext";
import { ClientProvider } from "./context/ClientContext";
import CartMainView from "./Components/Cart/CartMainView";
import AddToCartView from "./Components/Cart/AddToCartView";
import RemoveFromCartView from "./Components/Cart/RemoveFromCartView";
import CheckoutView from "./Components/Cart/CheckoutView";
import ApplyDiscountView from "./Components/Cart/ApplyDiscountView";
import ToastProvider from "./Components/Layout/ToastProvider";

//PATZAN
import ProductsMainView from "./Components/Products/ProductsMainView";
import ProvidersMainView from "./Components/Providers/ProvidersMainView";
import BrandsMainView from "./Components/Brands/BrandsMainView";
import CategoriesMainView from "./Components/Categories/CategoriesMainView";
import MeasuresMainView from "./Components/Measures/MeasuresMainView";



import React, { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [branchSelected, setBranchSelected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const userName = sessionStorage.getItem("userName");
    const userId = sessionStorage.getItem("userId");
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
      const historyLength = window.history.length;
      window.history.go(-historyLength);

      setTimeout(() => {
        window.history.replaceState(null, null, '/');
        window.location.replace('/');
      }, 100);

    } catch (error) {
      console.error('Error limpiando historial:', error);
      window.location.replace('/');
    }
  };

  // Prevenir navegación hacia atrás después del logout
  useEffect(() => {
    if (!isAuthenticated && !sessionStorage.getItem("userName")) {
      const preventBack = (event) => {
        window.history.pushState(null, null, window.location.pathname);
      };

      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener('popstate', preventBack);

      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [isAuthenticated]);

  return (
    <div className="w-100 vh-100">
      <Router>
        <CartProvider>
          <ClientProvider>
            <ToastProvider />
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
                    {/* Ruta independiente para SelectBranch */}
                    <Route
                      path="/SelectBranch/:userId"
                      element={<SelectBranch onSelect={onBranchSelect} />}
                    />

                    {/* Rutas principales con Layout */}
                    <Route path="/" element={<Layout logOut={onLogOutHandle} />}>
                      <Route index element={<Navigate to="/" replace />} />

                      {/* Rutas de DANNY */}
                      <Route path="/Users" element={<UsersMain />} />
                      <Route path="/Roles" element={<RolMain />} />
                      <Route path="/RolAccess/:rolId" element={<RolAccessView />} />
                      <Route path="/Branches" element={<BranchMain />} />
                      <Route path="/UserConf/:userId" element={<UserConfiguration />} />
                      <Route path="/ProductBranch/:productId" element={<ProductBranch />} />

                      {/* Rutas de PABLO */}
                      <Route path="/Clients" element={<ClientsMainView />} />
                      <Route path="/Cart" element={<CartMainView />} />
                      <Route path="/Cart/Add" element={<AddToCartView />} />
                      <Route path="/Cart/Remove" element={<RemoveFromCartView />} />
                      <Route path="/Cart/Checkout" element={<CheckoutView />} />
                      <Route path="/Cart/Discount" element={<ApplyDiscountView />} />

                      {/* Rutas de PATZAN */}
                      <Route path="/Products" element={<ProductsMainView/>} />
                      <Route path="/Providers" element={<ProvidersMainView />} />
                      <Route path="/Brands" element={<BrandsMainView />} />
                      <Route path="/Categories" element={<CategoriesMainView />} />
                      <Route path="/Measures" element={<MeasuresMainView />} />

                      {/* Rutas de DIEGO */}

                    </Route>
                  </>
                )}
            </Routes>
          </ClientProvider>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;