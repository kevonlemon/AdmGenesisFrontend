import { useEffect, useState } from 'react';
import { obtenerMaquina } from '../../utils/sistema/funciones';

export default function useMaquina() {
  const [maquina, setMaquina] = useState('0.0.0.0');
  useEffect(() => {
    obtenerMaquina().then((res) => setMaquina(res));
  }, []);
  return {
    maquina,
  };
}
