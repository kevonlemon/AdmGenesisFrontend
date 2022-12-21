// @KF-14/12/2022
import { URLAPIGENERAL } from '../../../../../config';
import axiosInst from '../../../../../utils/admnomina/axiosBirobid';

export function getEmpleados() {
  const url = `${URLAPIGENERAL}/empleados/listar`;
  return async () => {
    try {
      const res = await axiosInst.get(url);
      const EmpleadosJson = res.data.map((m) => ({
        codigoalternativo: m.codigo_Empleado,
        nombre: m.nombres,
        codigo: m.codigo,
      }));
      return EmpleadosJson;
    } catch (error) {
      return error;
    }
  };
}

export function getTipoContrato() {
  const url = `${URLAPIGENERAL}/TipoContrato/listar`;
  return async () => {
    try {
      const res = await axiosInst.get(url);
      const TipoContratoJson = res.data.map((m) => ({
        tabla: m.tabla,
        nombre: m.nombre,
        codigo: m.codigo,
        estado: m.estado,
        id: m.codigo,
      }));
      return TipoContratoJson;
    } catch (error) {
      return error;
    }
  };
}

