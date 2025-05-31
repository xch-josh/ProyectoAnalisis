import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AddRolView from './AddRolView'
import EditRolView from './EditRolView'

export default function RolMainView({ onSave, onEdit, onDelete, data, onGet }) {
    const [rolData, setRolData] = useState([]);
    const [rolState, setRolState] = useState(true);
    // Nuevo estado para la búsqueda
    const [searchTerm, setSearchTerm] = useState('');


    const deleteRol = (id) => {
        onDelete(id);
    };

    const getRol = async (id) => {
        let rolData = await onGet(id);
        setRolData(rolData);
    }

    // Función para filtrar usuarios basada en el término de búsqueda
    const filtered = data.filter(rol =>
        rol.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para manejar el cambio en el input de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para limpiar la búsqueda
    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className='w-100 h-100'>
            <form autoComplete='off'>
                <div className='row'>
                    <div className='mb-5'>
                        <h3 className='mb-0'>Roles</h3>
                        <hr className='my-0' />
                    </div>
                    <div className='row mt-4 mb-2 col-sm-12 mx-auto'>
                        <div className='d-flex justify-content-start col-md-4'>
                            <div className='col-md-1 d-flex justify-content-center align-content-center'>
                                <i className="bi bi-search my-auto"></i>
                            </div>
                            <div className='col-md-9 px-0 position-relative'>
                                <input
                                    type="text"
                                    id="txtSearch"
                                    className='form-control form-control-sm'
                                    placeholder='Buscar por nombre del rol'
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {/* Botón para limpiar búsqueda */}
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="btn btn-sm position-absolute"
                                        style={{
                                            right: '5px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            border: 'none',
                                            background: 'none',
                                            padding: '2px 6px'
                                        }}
                                        onClick={clearSearch}
                                        title="Limpiar búsqueda"
                                    >
                                        <i className="bi bi-x-circle text-muted"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='d-flex justify-content-end col-md-8 mb-1'>
                            <button type='button' id='btnAdd' className='btn btn-theme-primary btn-sm outline-none' data-bs-toggle="modal" data-bs-target="#modalAdd">
                                <span className='mx-2'><i className="bi bi-plus-lg"></i> Nuevo</span>
                            </button>
                        </div>
                    </div>

                    {/* Contador de resultados */}
                    <div className='col-12 mb-2'>
                        <small className='text-muted'>
                            {searchTerm ? (
                                `Mostrando ${filtered.length} de ${data.length} usuarios`
                            ) : (
                                `Total: ${data.length} roles`
                            )}
                            {searchTerm && ` para "${searchTerm}"`}
                        </small>
                    </div>

                    <div className='tableContainer overflow-auto'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" className='bg-theme-primary'>Nombre rol</th>
                                    <th scope='col' className='bg-theme-primary'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? (
                                    filtered.map(item => {
                                        return (
                                            <tr key={item.rolId}>
                                                <th><span className='my-auto'>{item.name}</span></th>
                                                <td>
                                                    <span className='w-100 text-end d-block pe-4'>
                                                        <button
                                                            type='button'
                                                            className='btn btn-sm btn-theme-seccondary me-1 outline-none'
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalEdit"
                                                            onClick={() => {  setRolState(item.state); getRol(item.rolId) }}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <Link 
                                                            to={`/RolAccess/${item.rolId}`}
                                                            className='btn btn-sm btn-theme-tertiary me-1 outline-none'
                                                        >
                                                            <i className="bi bi-gear"></i> 
                                                        </Link>
                                                        <button
                                                            type='button'
                                                            className='btn btn-sm btn-theme-danger outline-none'
                                                            onClick={() => deleteRol(item.rolId)}
                                                        >
                                                            <i className="bi bi-trash3"></i>
                                                        </button>
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    // Mensaje cuando no hay resultados
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="d-flex flex-column align-items-center">
                                                <i className="bi bi-search fs-1 text-muted mb-2"></i>
                                                <h5 className="text-muted">No se encontraron roles</h5>
                                                <p className="text-muted mb-2">
                                                    {searchTerm ?
                                                        `No hay roles que coincidan con "${searchTerm}"` :
                                                        'No hay roles para mostrar'
                                                    }
                                                </p>
                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={clearSearch}
                                                    >
                                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                                        Limpiar búsqueda
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AddRolView onSave={onSave} />

                <EditRolView rolState={rolState} onSave={onEdit} rolData={rolData}/>
            </form>
        </div>
    )
}
