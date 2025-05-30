import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GetAccess } from '../../../API_Service/User';

export default function SelectBranch({ onSelect, notBranchesHandle }) {
    const { userId } = useParams();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await GetAccess(userId);

                // Asegurar que siempre sea un array
                if (Array.isArray(data)) {
                    setBranches(data);
                } else if (data && Array.isArray(data.data)) {
                    // Si la respuesta viene envuelta en un objeto con propiedad 'data'
                    setBranches(data.data);
                } else if (data && typeof data === 'object') {
                    // Si es un objeto, convertirlo en array
                    setBranches([data]);
                } else {
                    console.warn("API no devolvió un array válido:", data);
                    setBranches([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error loading branches:", error);
                setBranches([]);
                setLoading(false);
            }
        };

        if (userId) {
            loadBranches();
        }
    }, [userId]);

    const handleCardClick = (branch) => {
        setSelectedBranch(branch.branchID);

        // Pequeño delay para mostrar la animación de selección
        setTimeout(() => {
            // Guardar en sessionStorage
            sessionStorage.setItem("branchId", branch.branchID);
            sessionStorage.setItem("branchName", branch.branchName);
            
            onSelect();

            window.location.href = '/';
        }, 500);
    };

    if (loading) {
        return (
            <div className='w-100 vh-100 d-flex justify-content-center align-items-center bg-light'>
                <div className="text-center">
                    <div className="spinner-border text-theme-seccondary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">Cargando sucursales...</p>
                </div>
            </div>
        );
    }

    if (!Array.isArray(branches) || branches.length === 0) {
        return (
            <div className='w-100 vh-100 d-flex justify-content-center align-items-center bg-light'>
                <div className="text-center">
                    <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                    <h4 className="mt-3 text-muted">No hay sucursales disponibles</h4>
                    <p className="text-muted">Contacta al administrador para asignar sucursales.</p>
                    {/* Botón para debugging */}
                    <button
                        className="btn btn-outline-primary mt-3"
                        onClick={() => notBranchesHandle()}
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-100 vh-100 d-flex flex-column justify-content-center align-items-center bg-light'>
            {/* Título */}
            <div className="mb-5 text-center">
                <h1 className="text-muted mb-2">Hola {sessionStorage.getItem('name')}</h1>
                <h3 className="text-theme-tertiary mb-2">Selecciona tu Sucursal</h3>
            </div>

            {/* Grid de sucursales */}
            <div className="container">
                <div className="row justify-content-center g-4">
                    {branches.map((branch, index) => {
                        // Validación adicional para cada elemento
                        if (!branch || typeof branch !== 'object') {
                            console.warn("Elemento de branch inválido:", branch);
                            return null;
                        }

                        return (
                            <div key={branch.branchID || index} className="col-lg-4 col-md-6 col-sm-8">
                                <div
                                    className={`card shadow text-center p-4 branch-card ${selectedBranch === branch.branchID ? 'selected' : ''}`}
                                    onClick={() => handleCardClick(branch)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderRadius: '15px',
                                        minWidth: '280px',
                                        animation: `fadeInScale 0.6s ease-out ${index * 0.1}s forwards`,
                                        opacity: 0,
                                        transform: selectedBranch === branch.branchID ? 'scale(0.95)' : 'scale(1)',
                                        border: selectedBranch === branch.branchID ? '3px solid #198754' : '1px solid #dee2e6',
                                        backgroundColor: selectedBranch === branch.branchID ? '#f0fff4' : 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedBranch !== branch.branchID) {
                                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedBranch !== branch.branchID) {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                    }}
                                    onMouseUp={(e) => {
                                        if (selectedBranch !== branch.branchID) {
                                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                                        }
                                    }}
                                >
                                    {/* Icono */}
                                    <div className="mb-3">
                                        <i
                                            className="bi bi-shop"
                                            style={{
                                                fontSize: '4rem',
                                                color: selectedBranch === branch.branchID ? '#198754' : '#9DBEBB',
                                                transition: 'all 0.3s ease'
                                            }}
                                        ></i>
                                    </div>

                                    {/* Nombre de la sucursal */}
                                    <h4 className={`card-title mb-2 ${selectedBranch === branch.branchID ? 'text-success' : 'text-theme-seccondary'}`}>
                                        {branch.branchName || 'Sucursal sin nombre'}
                                    </h4>

                                    {/* Indicador de selección */}
                                    {selectedBranch === branch.branchID ? (
                                        <div className="mt-3">
                                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.5rem' }}></i>
                                            <p className="text-success mt-2 mb-0 fw-bold">Seleccionando...</p>
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <span className="text-theme-seccondary">
                                                <i className="bi bi-cursor me-1"></i>
                                                Haz clic para continuar
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Información adicional */}
            <div className="mt-4 text-center">
                <small className="text-muted">
                    Mostrando {branches.length} sucursal{branches.length !== 1 ? 'es' : ''} disponible{branches.length !== 1 ? 's' : ''}
                </small>
            </div>

            {/* CSS inline para las animaciones */}
            <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .branch-card:active {
          transition: transform 0.1s ease !important;
        }

        .branch-card.selected {
          animation: pulse 1s ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(0.95); }
        }
      `}</style>
        </div>
    );
}