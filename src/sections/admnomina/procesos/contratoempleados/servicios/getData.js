import axios from 'axios';
import { URLAPIGENERAL } from '../../../../../config';

export function getEmpleados() {
  const user = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const funcion = async () => {
    try {
      const res = await axios(`${URLAPIGENERAL}/empleados/listar`, config);
      const clientesJson = res.data.map((m) => ({
        codigoalternativo: m.codigo_Empleado,
        nombre: m.nombres,
        codigo: m.codigo,
      }));
      return clientesJson;
    } catch (error) {
      return error;
    }
  };
  funcion();
}
