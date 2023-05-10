/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../../../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../../../../config";

class ServicesValidacionDocsIESS {

    /**
    * @param {{ 
    * fechadesde: string,
    * fechahasta: string,
    * empleadodesde: number,
    * empleadohasta: number
    * }}
    * @returns {Array<object>}   
    */
     ListarSolicitudesIESS({ fechadesde, fechahasta, empleadodesde, empleadohasta }) {
        const apiUrl = `${URLAPIGENERAL}/ValidarSolicitudesIESS/Listar?empleadodesde=${empleadodesde}&empleadohasta=${empleadohasta}&fechadesde=${fechadesde}&fechahasta=${fechahasta}`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @param {{ form: object }}
    * @returns {Promise<object>}    
    */
     ValidarDocumentosIess({ form }) {
        const apiUrl = `${URLAPIGENERAL}/ValidarSolicitudesIESS`;
        return axiosBirobid.post(apiUrl, form).then(res => res);
    }

    /**
    * @param {{ documento: object }}
    * @returns {Promise<object>}    
    */
     SubirDocumento({ documento }) {
        const apiUrl = `${URLAPIGENERAL}/ValidarSolicitudesIESS/subirdocumento`;
        return axiosBirobid.post(apiUrl, documento).then(res => res);
    }

}

const servicesValidacionDocsIESS = new ServicesValidacionDocsIESS();
export default servicesValidacionDocsIESS;