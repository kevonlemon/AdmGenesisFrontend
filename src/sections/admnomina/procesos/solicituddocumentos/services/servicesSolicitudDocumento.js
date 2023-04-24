/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../../../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../../../../config";

class ServicesSolicitudDocumento {
    /**
    * @returns {Promise<object>}    
    */
     Listar() {
        const apiUrl = `${URLAPIGENERAL}/SolicitudDocumentos/listar`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @returns {Promise<object>}    
    */
     ListarMotivos() {
        const apiUrl = `${URLAPIGENERAL}/SolicitudDocumentos/listarmotivos`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @param {{ form: object }}
    * @returns {Promise<object>}    
    */
     GrabarSolicitud({ form }) {
        const apiUrl = `${URLAPIGENERAL}/SolicitudDocumentos`;
        return axiosBirobid.post(apiUrl, form).then(res => res);
    }

    /**
    * @returns {Promise<int>}    
    */
    ObtenerUltimoNumSolicitud = async () => {
        const { data } = await axiosBirobid(`${URLAPIGENERAL}/SolicitudDocumentos/ultimoNumSolicitud`);
        return data;
    };
}

const servicesSolicitudDocumento = new ServicesSolicitudDocumento()
export default servicesSolicitudDocumento;