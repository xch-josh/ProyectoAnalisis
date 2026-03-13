import React, { useState, useEffect } from 'react';
import BrandService from '../Brands/BrandService';
import CategoryService from '../Categories/CategoryService';
import ProductService from './ProductService';

export default function ProductForm({ product, onSave, onCancel }) {
    // Estado inicial del formulario (producto vacío o existente)
    const [formData, setFormData] = useState({
        id: product?.id || null,
        codeBar: product?.codeBar || '',
        name: product?.name || '',
        purchasePrice: product?.purchasePrice || 0,
        gainPercentaje: product?.gainPercentaje || 0,
        unitPrice: product?.unitPrice || 0,
        description: product?.description || '',
        state: product?.state || 'Activo',
        measure_id: product?.measure_id || '',
        brand_id: product?.brand_id || '',
        category_id: product?.category_id || ''
    });

    // Estados para las listas desplegables
    const [measures, setMeasures] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);    // Cargar datos iniciales para los selectores
    useEffect(() => {
        // Cargar medidas, marcas y categorías desde sus respectivos servicios
        const fetchData = async () => {
            try {
                // Obtener medidas
                const measuresData = await ProductService.getMeasures();
                setMeasures(measuresData);
                
                // Obtener marcas
                const brandsData = await BrandService.getAll();
                setBrands(brandsData);
                
                // Obtener categorías
                const categoriesData = await CategoryService.getAll();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error al cargar datos para los selectores:', error);
            }
        };
        
        fetchData();
    }, []);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Calcular precio unitario automáticamente si cambian precio de compra o porcentaje
        if (name === 'purchasePrice' || name === 'gainPercentaje') {
            // Asegurarnos de que ambos valores sean números
            const purchasePrice = parseFloat(name === 'purchasePrice' ? value : formData.purchasePrice);
            const gainPercentaje = parseFloat(name === 'gainPercentaje' ? value : formData.gainPercentaje);
            
            if (!isNaN(purchasePrice) && !isNaN(gainPercentaje)) {
                const newUnitPrice = purchasePrice + (purchasePrice * (gainPercentaje / 100));
                // Asegurarnos de que newUnitPrice sea un número antes de usar toFixed
                if (!isNaN(newUnitPrice)) {
                    setFormData(prev => ({ ...prev, unitPrice: newUnitPrice.toFixed(2) }));
                }
            }
        }
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="codeBar" className="form-label">Código de Barras</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="codeBar" 
                        name="codeBar" 
                        value={formData.codeBar} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Nombre del Producto</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-4">
                    <label htmlFor="purchasePrice" className="form-label">Precio de Compra</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            className="form-control" 
                            id="purchasePrice" 
                            name="purchasePrice" 
                            value={formData.purchasePrice} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <label htmlFor="gainPercentaje" className="form-label">% de Ganancia</label>
                    <div className="input-group">
                        <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            className="form-control" 
                            id="gainPercentaje" 
                            name="gainPercentaje" 
                            value={formData.gainPercentaje} 
                            onChange={handleChange} 
                            required 
                        />
                        <span className="input-group-text">%</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <label htmlFor="unitPrice" className="form-label">Precio Unitario</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            className="form-control" 
                            id="unitPrice" 
                            name="unitPrice" 
                            value={formData.unitPrice} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-4">
                    <label htmlFor="measure_id" className="form-label">Unidad de Medida</label>
                    <select 
                        className="form-select" 
                        id="measure_id" 
                        name="measure_id" 
                        value={formData.measure_id} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Seleccione una medida</option>
                        {measures.map(measure => (
                            <option key={measure.id} value={measure.id}>{measure.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="brand_id" className="form-label">Marca</label>
                    <select 
                        className="form-select" 
                        id="brand_id" 
                        name="brand_id" 
                        value={formData.brand_id} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Seleccione una marca</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="category_id" className="form-label">Categoría</label>
                    <select 
                        className="form-select" 
                        id="category_id" 
                        name="category_id" 
                        value={formData.category_id} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-8">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea 
                        className="form-control" 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="3"
                    ></textarea>
                </div>
                <div className="col-md-4">
                    <label htmlFor="state" className="form-label">Estado</label>
                    <select 
                        className="form-select" 
                        id="state" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange}
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-theme-primary">
                    Guardar
                </button>
            </div>
        </form>
    );
}