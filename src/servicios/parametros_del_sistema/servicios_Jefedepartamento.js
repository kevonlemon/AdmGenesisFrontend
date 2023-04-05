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

    /**
    * @param {{ codigo: number }}
    * @returns {Promise<Array<object>>}    
    */
     Buscar({ codigo }) {
        const apiUrl = `${URLAPIGENERAL}/jefedepartamento/buscar?codigo=${codigo}`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }

    /**
    * @param {{ datos: object }}
    * @returns {Promise<number>}    
    */
     Grabar({ datos }) {
        const apiUrl = `${URLAPIGENERAL}/jefedepartamento`;
        return axiosBirobid.post(apiUrl, datos).then(res => res);
    }

    /**
    * @param {{ datos: object }}
    * @returns {Promise<number>}    
    */
     Editar({ datos }) {
        const apiUrl = `${URLAPIGENERAL}/jefedepartamento`;
        return axiosBirobid.put(apiUrl, datos).then(res => res);
    }

    /**
    * @param {{ codigo: number }}
    * @returns {Promise<Array<object>>}    
    */
     Eliminar({ codigo }) {
        const apiUrl = `${URLAPIGENERAL}/jefedepartamento?Codigo=${codigo}`;
        return axiosBirobid.delete(apiUrl).then(res => res.data);
    }
}

const serviciosJefeDepartamento = new ServiciosJefeDepartamento();
export default serviciosJefeDepartamento;