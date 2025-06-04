// Servicio para productos que utiliza la conexión real con la API del backend
import ProductAPIService from '../../API_Services/ProductAPIService';
import MeasureAPIService from '../../API_Services/MeasureAPIService';

export const ProductService = {
    // Obtener todos los productos
    getAll: async () => {
        try {
            return await ProductAPIService.getAllFormatted();
        } catch (error) {
            console.error('Error en ProductService.getAll:', error);
            throw error;
        }
    },

    // Obtener un producto por ID
    getById: async (id) => {
        try {
            return await ProductAPIService.getByIdFormatted(id);
        } catch (error) {
            console.error(`Error en ProductService.getById con ID ${id}:`, error);
            throw error;
        }
    },    // Crear un nuevo producto
    create: async (productData) => {
        try {
            // Transformar datos del formato del componente al formato esperado por la API
            const apiData = {
                CodeBar: productData.codeBar,
                Name: productData.name,
                PurchasePrice: parseFloat(productData.purchasePrice),
                GainPercentage: parseFloat(productData.gainPercentaje), // Corregido de gainPercentaje a GainPercentage
                UnitPrice: parseFloat(productData.unitPrice),
                Description: productData.description,
                State: productData.state === 'Activo', // Transformar a booleano
                MeasureId: parseInt(productData.measure_id),
                BrandId: parseInt(productData.brand_id),
                CategoryId: parseInt(productData.category_id)
            };
            
            return await ProductAPIService.create(apiData);
        } catch (error) {
            console.error('Error en ProductService.create:', error);
            throw error;
        }
    },    // Actualizar un producto existente
    update: async (id, productData) => {
        try {
            // Transformar datos del formato del componente al formato esperado por la API
            const apiData = {
                CodeBar: productData.codeBar,
                Name: productData.name,
                PurchasePrice: parseFloat(productData.purchasePrice),
                GainPercentage: parseFloat(productData.gainPercentaje), // Corregido de gainPercentaje a GainPercentage
                UnitPrice: parseFloat(productData.unitPrice),
                Description: productData.description,
                State: productData.state === 'Activo', // Transformar a booleano
                MeasureId: parseInt(productData.measure_id),
                BrandId: parseInt(productData.brand_id),
                CategoryId: parseInt(productData.category_id)
            };
            
            return await ProductAPIService.update(id, apiData);
        } catch (error) {
            console.error(`Error en ProductService.update con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un producto
    delete: async (id) => {
        try {
            return await ProductAPIService.delete(id);
        } catch (error) {
            console.error(`Error en ProductService.delete con ID ${id}:`, error);
            throw error;
        }
    },

    // Obtener datos de medidas (ahora desde la API)
    getMeasures: async () => {
        try {
            return await MeasureAPIService.getAllFormatted();
        } catch (error) {
            console.error('Error en ProductService.getMeasures:', error);
            // Fallback a datos simulados en caso de error
            return [
                { id: 1, name: 'Unidad' },
                { id: 2, name: 'Kilogramo' },
                { id: 3, name: 'Litro' },
                { id: 4, name: 'Metro' },
                { id: 5, name: 'Caja' },
            ];
        }
    }
};

export default ProductService;