/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../config";

class ServiciosMantenimientoGenerico {
    /**
    * @param {{ tabla: string }}
    * @returns {Promise<Array<object>>}    
    */
    listarPorTabla({ tabla }) {
        const apiUrl = `${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=${tabla}`;
        return axiosBirobid.get(apiUrl).then(res => res.data);
    }
}

const serviciosMantenimientoGenerico = new ServiciosMantenimientoGenerico();
export default serviciosMantenimientoGenerico;