import axios from "axios";
import { URLAPIGENERAL } from "../../config";
// import { URLRUC } from '../../config';
/* eslint-disable no-restricted-syntax */
// ***************** FUNCIONES JS ***********************
// FORMETEA LA FECHA
export const formaterarFecha = (fecha, separador, union) => {
  try {
    let f = String(fecha).substring(0, 10)
    f = f.split(separador)
    f = f.reverse()
    f = f.join(union)
    return f
  } catch {
    return "--/--/----"
  }
}
export const noEsVacio = (formulario, propiedades = []) => {
  try {
    let valido = false;
    if (propiedades.length > 0) {
      propiedades.forEach((prop) => {
        // eslint-disable-next-line no-prototype-builtins
        if (formulario.hasOwnProperty(prop)) {
          delete formulario[prop];
        }
      });
    }
    for (const clave in formulario) {
      // eslint-disable-next-line no-prototype-builtins
      if (formulario.hasOwnProperty(clave)) {
        const valor = String(formulario[clave]).trimEnd().trimStart();
        valido = valor !== "";
        if (!valor) {
          break;
        }
      }
    }
    return valido;
  } catch {
    return false;
  }
};

export const esCorreo = (param) => {
  try {
    const correo = String(param);
    let valor = false;
    const expr = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (expr.test(correo)) {
      valor = true;
    }
    return valor;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const esCedula = (cedula) => {
  try {
    const ced = cedula.trim();
    let valor = false;
    let [suma, mul, index] = [0, 1, ced.length];
    // eslint-disable-next-line no-plusplus
    while (index--) {
      const num = ced[index] * mul;
      suma += num - (num > 9) * 9;
      // eslint-disable-next-line no-bitwise
      mul = 1 << index % 2;
    }

    if (suma % 10 === 0 && suma > 0) {
      valor = true;
    } else {
      valor = false;
    }
    return valor;
  } catch {
    return false;
  }
};
export const validarIdentificacion = async (tipo, identificacion) => {
  let respuesta = "false";
  const itipo =
    tipo === "04"
      ? `GetRucs?id=${identificacion}`
      : `GetCedulas?id=${identificacion}`;
  const { data } = await axios(`http://181.198.213.18:8083//Home/${itipo}`);
  console.log(data);
  if (tipo === "04") {
    respuesta = `${data[0].Razon_social}`.trim().length > 0;
  }
  if (tipo === "05") {
    respuesta = `${data[0].Nombre}`.trim().length > 0;
  }

  console.log(respuesta);
  return respuesta;
};
// export const esRuc = async (ruc, url) => {
//   try {
//     const { data } = axios(`${url}GetRucs?id=${ruc}`);
//     return true;
//   } catch {
//     return false;
//   }
// };

// export const UsarBaseLocal = (metodo, clave, valor) => {
//   if (metodo === 'set') {
//     window.localStorage.setItem(clave, valor);
//   }
//   return JSON.parse(window.localStorage.getItem(clave));
// }

export const LoginBirobid = async (formulario) => {
  const { data } = await axios.post(`${URLAPIGENERAL}/login/authenticate`, formulario);
  const jsondata = JSON.stringify(data);
  window.localStorage.setItem('session', jsondata);
}

export const obtenerMaquina = async () => {
  const { data } = await axios('https://api.ipify.org/?format=json');
  return data.ip
}

export const generarCodigo = (letra, num) => {
  // const letra = 'C';
  // const num = 223;
  const ceros = '00000';
  const nums = num.toString();
  const cero1 = ceros.split('');
  // eslint-disable-next-line no-plusplus
  for (let step = 0; step < nums.length; step++) {
    cero1.pop();
  }
  const cero2 = cero1.join('');
  return `${letra}${cero2}${num}`;
};

export const esAlfanumerico = (param) => {
  try {
    const codigo = String(param);
    let valor = false;
    const expr = /^[0-9a-zA-Z]+$/;
    if (expr.test(codigo)) {
      valor = true;
    }
    return valor
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const formatearHora = (hora) => {
  try{
      const h = String(hora).substring(0, 8)
      return h
  } catch {
      return '00-00-00'
  }
}