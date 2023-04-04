/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../config";

class ServiciosBanco {
    /**
    * @returns {Promise<Array<object>>}    
    */
    Listar() {
        const apiUrl = `${URLAPIGENERAL}/bancos/listar`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }
}

const serviciosBanco = new ServiciosBanco();
export default serviciosBanco;