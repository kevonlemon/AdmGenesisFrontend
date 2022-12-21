import axiosBirobid from '../../../../../utils/admnomina/axiosBirobid';

/**
 * @param {object} datos
 * @returns {Promise<number>}
 */
 export const subirArchivos = (datos) => axiosBirobid.post('/empleados/subirdocumento', datos).then((res) => res.data);