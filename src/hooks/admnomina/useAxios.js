import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import useMensaje from './useMensaje';
import { URLAPIGENERAL } from '../../config';
import { PATH_AUTH } from '../../routes/paths';

axios.defaults.baseURL = URLAPIGENERAL;

/**
 * @param {object} axiosParametros
 * @returns
 */
export default function useAxios(axiosParametros) {
  const { token } = JSON.parse(window.localStorage.getItem('session'));
  const navegacion = useNavigate();
  const { mensajeSistema } = useMensaje();
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const resolverPeticion = async (parametros) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const { data } = await axios.request({ ...parametros, headers });
      setRespuesta(data);
    } catch (error) {
      setError(error);
      if (error.response.status === 401) {
        navegacion(PATH_AUTH.login);
        mensajeSistema('Su sesion expiró', 'error');
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    resolverPeticion(axiosParametros);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { respuesta, error, cargando };
}
