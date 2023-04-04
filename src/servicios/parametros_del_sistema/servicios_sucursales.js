/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../config";

class ServiciosSucursal {
    /**
    * @returns {Promise<Array<object>>}    
    */
    Listar() {
        const apiUrl = `${URLAPIGENERAL}/sucursales/listar`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }
}

const serviciosSucursal = new ServiciosSucursal();
export default serviciosSucursal;