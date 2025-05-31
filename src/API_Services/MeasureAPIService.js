import { API_CONFIG, getRequestConfig, handleApiResponse, transformBoolean, transformState } from './apiConfig';

export const MeasureAPIService = {  // Obtener todas las medidas
  getAll: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/Measure`, getRequestConfig());
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error al obtener medidas:', error);
      throw error;
    }
  },
  // Obtener una medida por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/Measure/${id}`, getRequestConfig());
      return await handleApiResponse(response);
    } catch (error) {
      console.error(`Error al obtener medida con ID ${id}:`, error);
      throw error;
    }
  },
  // Crear una nueva medida
  create: async (measureData) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Measure`, 
        getRequestConfig('POST', measureData)
      );
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error al crear medida:', error);
      throw error;
    }
  },
  // Actualizar una medida
  update: async (id, measureData) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Measure`, 
        getRequestConfig('PUT', measureData)
      );
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error(`Error al actualizar medida con ID ${id}:`, error);
      throw error;
    }
  },
  // Eliminar una medida
  delete: async (id) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Measure/${id}`, 
        getRequestConfig('DELETE')
      );
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error(`Error al eliminar medida con ID ${id}:`, error);
      throw error;
    }
  },

  // Función helper para transformar datos del backend al formato del frontend
  transformToFrontendFormat: (backendMeasure) => {
    return {
      id: backendMeasure.measureId,
      name: backendMeasure.name,
      state: transformState(backendMeasure.state)
    };
  },

  // Función para obtener todas las medidas transformadas al formato del frontend
  getAllFormatted: async () => {
    try {
      const measures = await MeasureAPIService.getAll();
      return measures.map(MeasureAPIService.transformToFrontendFormat);
    } catch (error) {
      console.error('Error al obtener medidas formateadas:', error);
      throw error;
    }
  },

  // Función para obtener una medida por ID transformada al formato del frontend
  getByIdFormatted: async (id) => {
    try {
      const measure = await MeasureAPIService.getById(id);
      return MeasureAPIService.transformToFrontendFormat(measure);
    } catch (error) {
      console.error(`Error al obtener medida formateada con ID ${id}:`, error);
      throw error;
    }
  }
};

export default MeasureAPIService;
