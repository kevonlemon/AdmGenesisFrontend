import { useContext } from 'react';
import { MensajeContext } from '../../contexts/admnomina/MensajeContext';

// ----------------------------------------------------------------------

const useMensajeGeneral = () => useContext(MensajeContext);

export default useMensajeGeneral;
