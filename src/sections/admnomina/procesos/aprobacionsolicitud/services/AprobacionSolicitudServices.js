/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../../../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../../../../config";

class ServicesAprobacionSolicitud {

    /**
    * @param {{ 
    * fechadesde: string,
    * fechahasta: string,
    * empleadodesde: number,
    * empleadohasta: number,
    * motivo: string 
    * }}
    * @returns {Array<object>}   
    */
     ListarSolicitudes({ fechadesde, fechahasta, empleadodesde, empleadohasta, motivo }) {
        const apiUrl = `${URLAPIGENERAL}/AprobacionSolicitudes/Listar?empleadodesde=${empleadodesde}&empleadohasta=${empleadohasta}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&motivo=${motivo}`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }

    /**
    * @param {{ form: object }}
    * @returns {Promise<object>}    
    */
     ActualizarSolicitudes({ form }) {
        const apiUrl = `${URLAPIGENERAL}/AprobacionSolicitudes/Actualizar`;
        return axiosBirobid.post(apiUrl, form).then(res => res);
    }

    /**
    * @param {{ 
    * url: string,
    * nombres: string,
    * motivosolicitud: number
    * }}
    * @returns {Array<byte>}   
    */
     DescargarSolicitudes({ url, nombres, motivosolicitud }) {
        const apiUrl = `${URLAPIGENERAL}/AprobacionSolicitudes/descargarsolicitud?url=${url}&nombres=${nombres}&motivoSolicitud=${motivosolicitud}`;
        return axiosBirobid.get(apiUrl).then(res => res);
    }
}

const servicesAprobacionSolicitud = new ServicesAprobacionSolicitud();
export default servicesAprobacionSolicitud;