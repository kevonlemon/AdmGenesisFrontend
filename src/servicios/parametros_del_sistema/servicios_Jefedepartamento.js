/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../config";

class ServiciosJefeDepartamento {
    /**
    * @returns {Promise<Array<object>>}    
    */
    Listar() {
        const apiUrl = `${URLAPIGENERAL}/jefedepartamento/listar`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }
}

const serviciosJefeDepartamento = new ServiciosJefeDepartamento();
export default serviciosJefeDepartamento;