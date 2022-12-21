// @KF-14/12/2022
import { URLAPIGENERAL } from '../../../../../config';
import axiosBirobid from '../../../../../utils/admnomina/axiosBirobid';

/**
 * @param {object} datos
 * @returns {Promise<number>}
 */
export const GuardarArchivo = (datos, formulario) => {
  const formularioEnviado = {
    tipoContrato: formulario.TipoContrato,
    empleado: formulario.Empleado,
    urlActa: '',
    urlPago: '',
    urlContrato: '',
    observacion: formulario.Observacion,
    diaInicioJornada: formulario.DiaInicioJornada,
    diaFinJornada: formulario.DiaFinJornada,
    horaInicioJornada: formulario.HoraInicioJornada,
    horaFinJornada: formulario.HoraFinJornada,
    periodoDescanso: formulario.PeriodoDescanso,
    fechaContrato: formulario.FechaContrato,
    fechaTerminacion: formulario.FechaTerminacion,
    fecha_ing: formulario.Fecha_ing,
    maquina: formulario.Maquina,
    usuario: formulario.Usuario,
    archivo: datos.archivo,
    nombreArchivo: datos.nombreArchivo,
  };
  try {
    axiosBirobid.post('/TipoContrato/guardar', formularioEnviado).then((res) => res.data);
    return true;
  } catch (error) {
    return false;
  }
};
