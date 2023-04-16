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
}

// servicios
const serviciosControlHorario = new ServicesControlHorario()
export default serviciosControlHorario;