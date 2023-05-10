/* eslint-disable class-methods-use-this */
import axiosBirobid from "../../../../../utils/admnomina/axiosBirobid";
import { URLAPIGENERAL } from "../../../../../config";

class BiometricoServices {

    /**
    * @param {{ form: object }}
    * @returns {Promise<object>}    
    */
     Grabar({ form }) {
        const apiUrl = `${URLAPIGENERAL}/Biometrico`;
        return axiosBirobid.post(apiUrl, form).then(res => res);
    }

}

const servicesBiometrico = new BiometricoServices();
export default servicesBiometrico;