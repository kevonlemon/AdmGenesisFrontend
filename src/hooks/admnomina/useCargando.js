import { useContext } from 'react';
import { CargandoContext } from '../../contexts/admnomina/cargandoContext';

// ----------------------------------------------------------------------

const useCargando = () => useContext(CargandoContext);

export default useCargando;
