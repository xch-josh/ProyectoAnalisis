import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import ClientSelector from './ClientSelector';
import ProductAPIService from '../../API_Services/ProductAPIService';
import { toast } from 'react-toastify';
import SweetAlert2 from '../../SweetAlert2';

export default function AddToCartView() {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showClientSelector, setShowClientSelector] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar datos de productos desde la API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data = [];

                if (sessionStorage.getItem('branchId') && sessionStorage.getItem('branchId') !== 0) {
                    data = await ProductAPIService.getAll(sessionStorage.getItem('branchId'));
                }

                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                toast.error('No se pudieron cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);    // Filtrar productos basados en el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category && product.category.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.codeBar && product.codeBar.includes(searchTerm))
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleAddToCart = async (product, stock) => {
        if(stock >= product.quantity){
            try {
                console.log(product);
                setLoading(true);
                await addToCart(product);
                navigate('/Cart'); // Redirigir al carrito después de añadir
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                toast.error('No se pudo agregar el producto al carrito');
            } finally {
                setLoading(false);
            }
        }
        else{
            SweetAlert2.ShowMessage('Stock insuficiente', 'Alerta', 'warning');
        }
    };

    return (
        <div className='w-100 h-100'>
            <div className='row'>
                <div className='mb-5'>
                    <h3 className='mb-0'>Carrito - Agregar productos</h3>
                    <hr className='my-0' />
                </div>

                <div className='col-12'>
                    <div className='row mb-4 mt-3'>
                        <div className='col-md-4'>
                            <div className='input-group'>
                                <span className='input-group-text'>
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='col-md-2'>
                            <div className='input-group'>
                                <span className='input-group-text'>Cantidad</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                />
                            </div>
                        </div>
                        <div className='col-md-6 d-flex justify-content-end'>
                            <Link to="/Cart" className="btn btn-theme-primary">
                                <i className="bi bi-arrow-left"></i> Volver al Carrito
                            </Link>
                        </div>
                    </div>

                    <div className='row'>                        {loading ? (
                        <div className="col-12 text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando productos...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-12 text-center my-5">
                            <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-3">No se encontraron productos</h4>
                            <p>Intenta con otra búsqueda</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <div className="col-md-4 mb-4" key={product.id}>
                                <div className="card h-100 shadow">
                                    <div className="card-body pb-0">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">
                                            <span className="badge bg-theme-primary text-dark me-2">{product.categoryName || 'Sin categoría'}</span>
                                            <span className="badge bg-theme-seccondary me-2">{product.brandName || 'Sin marca'}</span>
                                            {/* Stock sería manejado con un servicio de inventario */}
                                        </p>
                                        <div>
                                            <small className="text-muted">Código: {product.codeBar}</small>
                                        </div>
                                        <div>
                                            <small className="text-muted">Existencias: <strong>{product.stock}</strong></small>
                                        </div>
                                        <div>
                                            <h5 className='text-muted'><strong>Precio: Q{product.unitPrice.toFixed(2)}</strong></h5>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between">
                                        <button
                                            className="btn btn-theme-seccondary w-100"
                                            onClick={() => {
                                                console.log(product);

                                                const dataModel = {
                                                    "quantity": quantity,
                                                    "purchasePrice": product.purchasePrice,
                                                    "unitPrice": product.unitPrice,
                                                    "discount": 0,
                                                    "salePrice": product.unitPrice,
                                                    "subtotal": (product.unitPrice * quantity),
                                                    "productId": product.id,
                                                    "userId": sessionStorage.getItem('userId'),
                                                    "branchId": sessionStorage.getItem('branchId')
                                                };

                                                handleAddToCart(dataModel, product.stock);
                                            }}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-cart-plus"></i> Agregar al carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    </div>                </div>
            </div>

            {/* Modal para seleccionar cliente */}
            {showClientSelector && (
                <ClientSelector onClose={() => setShowClientSelector(false)} />
            )}
        </div>
    );
}