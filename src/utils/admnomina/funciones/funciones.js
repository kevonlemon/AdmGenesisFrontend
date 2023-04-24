import axios from 'axios';
import { format } from 'date-fns';
import moment from 'moment';
/**
 * @param {{fecha: string, separador: string, union: string}}
 * @returns {string}
 */
export const formatearFecha = ({ fecha, separador, union }) => {
  try {
    let f = String(fecha).substring(0, 10);
    f = f.split(separador);
    f = f.reverse();
    f = f.join(union);
    return f;
  } catch {
    return '--/--/----';
  }
};

/**
 * @param {string} correo
 * @returns {boolean}
 */
export const esCorreo = (correo) => {
  try {
    let valor = false;
    const expr = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (expr.test(correo)) {
      valor = true;
    }
    return valor;
  } catch (error) {
    return false;
  }
};

/**
 * @param {string} cedula
 * @returns {boolean}
 */
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

/**
 * @param {string} tipo
 * @param {string} identificacion
 * @returns {boolean}
 */
export const validarIdentificacion = async (tipo, identificacion) => {
  let respuesta = false;
  const itipo = tipo === '04' ? `GetRucs?id=${identificacion}` : `GetCedulas?id=${identificacion}`;
  const { data } = await axios(`http://181.198.213.18:8083//Home/${itipo}`);
  console.log(data);
  if (tipo === '04') {
    respuesta = `${data[0].Razon_social}`.trim().length > 0;
  }
  if (tipo === '05') {
    respuesta = `${data[0].Nombre}`.trim().length > 0;
  }
  return respuesta;
};

/**
 * @returns {string}
 */

export const obtenerMaquina = async () => {
  const { data } = await axios('https://api.ipify.org/?format=json');
  return data.ip;
};

/**
 * @param {{inicial: string, numero: number, cantidadceros: number}}
 * @returns {string}
 */
export const generarCodigo = ({ inicial, numero, cantidadceros }) => {
  const ceros = Array.from({ length: cantidadceros }, () => 0);
  const nums = numero.toString();
  // eslint-disable-next-line no-plusplus
  for (let step = 0; step < nums.length; step++) {
    ceros.pop();
  }
  const cero2 = ceros.join('');
  return `${inicial}${cero2}${numero}`;
};

/**
 * @param {string} codigo
 * @returns {boolean}
 */
export const esAlfanumerico = (codigo) => {
  try {
    let valor = false;
    const expr = /^[0-9a-zA-Z]+$/;
    if (expr.test(codigo)) {
      valor = true;
    }
    return valor;
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * @param {string} hora
 * @returns {string}
 */
export const formatearHora = (hora) => {
  try {
    const h = hora.substring(0, 8);
    return h;
  } catch {
    return '00-00-00';
  }
};
/**
 * @param {string} numero
 * @param {number} decimales
 * @returns {boolean}
 */
export const validarNumeroDeDigitos = (numero, decimales) => {
  let resultado = true;
  const esdecimal = numero.includes('.');
  if (esdecimal) {
    const indice = numero.indexOf('.') + 1;
    const totalcaracteres = numero.substring(indice);
    resultado = totalcaracteres.length < decimales;
  }
  return resultado;
};

/**
 * @returns {object}
 */
export const obtenerPrimerUltimoDiaMes = () => {
  const date = new Date();
  const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
  const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { primerDia, ultimoDia };
};

/**
 * @param {{fecha: Date}}
 * @returns {Date}
 */
// eslint-disable-next-line no-restricted-globals
export const validarFecha = (fecha) => fecha instanceof Date && !isNaN(fecha);

/**
 * @param {Date} fecha
 * @returns {number}
 */
export const calcularEdad = (fecha) => {
  const diferencia = Date.now() - fecha.getTime();
  fecha = new Date(diferencia);
  return Math.abs(fecha.getUTCFullYear() - 1970);
};

export const abortarPeticion = () => {
  const controlador = new AbortController();
  return controlador;
};

export function fDateEs(date) {
  const opciones = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const formatoFecha = new Intl.DateTimeFormat('es-ES', opciones);
  const fecha = new Date(date);

  return formatoFecha.format(fecha);
}

export default moment;

export const convertirFecha = (fecha) => {
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // agregar un cero inicial si el mes es menor que 10
  const day = fecha.getDate().toString().padStart(2, '0'); // agregar un cero inicial si el día es menor que 10
  const dateString = `${year}-${month}-${day}`;
  return dateString;
}
