/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../config";

class ServiciosLocaciones {
    /**
     * @returns {Promise<Array<object>>}  
     */
    listarProvincias() {
        const apiUrl = `${URLAPIGENERAL}/provincias/listar`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }

    /**
     * @param {{ provincia: string }}
     * @returns {Promise<Array<object>>}    
    */
    listarCantones({ provincia }) {
        const apiUrl = `${URLAPIGENERAL}/cantones/buscarporprovincia?provincia=${provincia}`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }

    /**
     * @param {{ canton: string }}
     * @returns {Promise<Array<object>>}    
    */
    listarParroquias({ canton }) {
        const apiUrl = `${URLAPIGENERAL}/parroquias/buscarporparroquia?canton=${canton}`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }

}

const serviciosLocaciones = new ServiciosLocaciones();
export default serviciosLocaciones;