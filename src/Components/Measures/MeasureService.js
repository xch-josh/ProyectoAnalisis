import { MeasureAPIService } from '../../API_Services/MeasureAPIService';

class MeasureService {
  // Obtener todas las medidas
  async getAllMeasures() {
    try {
      return await MeasureAPIService.getAllFormatted();
    } catch (error) {
      console.error('Error en MeasureService.getAllMeasures:', error);
      throw new Error('No se pudieron cargar las medidas');
    }
  }
  // Obtener una medida por ID
  async getMeasureById(id) {
    try {
      if (!id) {
        throw new Error('ID de medida requerido');
      }
      return await MeasureAPIService.getByIdFormatted(id);
    } catch (error) {
      console.error(`Error en MeasureService.getMeasureById(${id}):`, error);
      throw new Error(`No se pudo cargar la medida con ID ${id}`);
    }
  }
  // Crear una nueva medida
  async createMeasure(measureData) {
    try {
      // Validaciones
      if (!measureData.name || measureData.name.trim() === '') {
        throw new Error('El nombre de la medida es requerido');
      }

      const measure = {
        Name: measureData.name.trim(),
        State: true
      };

      const result = await MeasureAPIService.create(measure);
      console.log('Medida creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en MeasureService.createMeasure:', error);
      throw error;
    }
  }
  // Actualizar una medida
  async updateMeasure(measureData) {
    try {
      // Validaciones
      if (!measureData.measureId) {
        throw new Error('ID de medida requerido para actualizar');
      }
      if (!measureData.name || measureData.name.trim() === '') {
        throw new Error('El nombre de la medida es requerido');
      }

      const measure = {
        MeasureId: measureData.measureId,
        Name: measureData.name.trim(),
        State: true
      };

      const result = await MeasureAPIService.update(measureData.measureId, measure);
      console.log('Medida actualizada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en MeasureService.updateMeasure:', error);
      throw error;
    }
  }
  // Eliminar una medida
  async deleteMeasure(id) {
    try {
      if (!id) {
        throw new Error('ID de medida requerido para eliminar');
      }

      const result = await MeasureAPIService.delete(id);
      console.log('Medida eliminada exitosamente:', result);
      return result;
    } catch (error) {
      console.error(`Error en MeasureService.deleteMeasure(${id}):`, error);
      throw error;
    }
  }

  // Validar datos de medida
  validateMeasureData(measureData) {
    const errors = [];

    if (!measureData.name || measureData.name.trim() === '') {
      errors.push('El nombre de la medida es requerido');
    }

    if (measureData.name && measureData.name.length > 50) {
      errors.push('El nombre de la medida no puede exceder 50 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new MeasureService();
