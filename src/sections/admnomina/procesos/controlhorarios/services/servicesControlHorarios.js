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
        const apiUrl = `${URLAPIGENERAL}/controlhorarios/editar`;
        return axiosBirobid.post(apiUrl, horario).then(res => res);
    }

    /**
    * @param {{ horario: object }}
    * @returns {Promise<object>}    
    */
    EliminarHorario({ horario }) {
        const apiUrl = `${URLAPIGENERAL}/controlhorarios/eliminar`;
        return axiosBirobid.post(apiUrl, horario).then(res => res);
    }
}

const serviciosControlHorario = new ServicesControlHorario()
export default serviciosControlHorario;