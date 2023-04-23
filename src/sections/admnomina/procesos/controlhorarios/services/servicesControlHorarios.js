/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../../../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../../../../config";

class ServicesControlHorario {
    /**
    * @returns {Promise<object>}    
    */
     Listar() {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios/listar`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @param {{ empleado: number }}
    * @returns {Promise<object>}    
    */
     Buscar({ empleado }) {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios/buscar?Empleado=${empleado}`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @returns {Promise<object>}    
    */
     ObtenerUltimoRegistroHorario() {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios/obtenerUltiReg`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @param {{ horario: object }}
    * @returns {Promise<object>}    
    */
     GrabarHorario({ horario }) {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios`;
        return axiosBirobid.post(apiUrl, horario).then(res => res);
    }

    /**
    * @param {{ horario: object }}
    * @returns {Promise<object>}    
    */
     EditarHorario({ horario }) {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios`;
        return axiosBirobid.put(apiUrl, horario).then(res => res);
    }

    /**
    * @param {{ 
    *  Codigo: number,
    *  Empleado: number,
    *  HoraDesde: string,
    *  HoraHasta: string,
    *  FechaDesde: date,
    *  FechaHasta: date
    * }}
    * @returns {Promise<object>}    
    */
    EliminarHorario({ Codigo, Empleado, HoraDesde, HoraHasta, FechaDesde, FechaHasta }) {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios?Codigo=${Codigo}&Empleado=${Empleado}&HoraDesde=${HoraDesde}&HoraHasta=${HoraHasta}&FechaDesde=${FechaDesde}&FechaHasta=${FechaHasta}`;
        return axiosBirobid.delete(apiUrl).then(res => res);
    }
}

const serviciosControlHorario = new ServicesControlHorario()
export default serviciosControlHorario;