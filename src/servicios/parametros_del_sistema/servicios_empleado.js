/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../config";

class ServiciosEmpleado {
    /**
    * @returns {Promise<Array<object>>}    
    */
    Listar() {
        const apiUrl = `${URLAPIGENERAL}/empleados/listar`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }
}

const serviciosEmpleados = new ServiciosEmpleado();
export default serviciosEmpleados;