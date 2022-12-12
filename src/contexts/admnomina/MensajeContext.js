import { createContext, useState } from 'react';

export const MensajeContext = createContext();

// eslint-disable-next-line react/prop-types
export const MensajeProvider = ({ children }) => {
  const [abrirModalPregunta, setAbrirModalPregunta] = useState(false);
  const [mensajePregunta, setMensajePregunta] = useState('');
  const [abrirModalGenerico, setAbrirModalGenerico] = useState(false);
  const [mensajeGenerico, setMensajeGenerico] = useState({
    tipo: 'warning',
    mensaje: '',
    tipoMantenimiento: 'nuevo',
    esMantenimiento: false,
  });
  const [ejecutarFuncionSi, setEjecutarFuncionSi] = useState({
    funcion: () => {},
  });
  const [ejecutarFuncionAceptar, setEjecutarFuncionAceptar] = useState({
    funcion: () => {},
  });
  /**
   *
   * @param {{mensaje: string, ejecutarFuncionSi}}
   */
  const mensajeSistemaPregunta = ({ mensaje, ejecutarFuncion = () => {} }) => {
    setMensajePregunta(mensaje);
    setEjecutarFuncionSi({ ...ejecutarFuncionSi, funcion: ejecutarFuncion });
    setAbrirModalPregunta(true);
  };
  /**
   * Mensaje del sistema
   * @param {{ tipo: string, mensaje: string, tipoMantenimiento: string, esMantenimiento: boolean }}
   */
  const mensajeSistemaGenerico = ({
    tipo = 'warning',
    mensaje,
    tipoMantenimiento = 'nuevo',
    esMantenimiento = false,
    ejecutarFuncion = () => {},
  }) => {
    setMensajeGenerico({
      tipo,
      mensaje,
      tipoMantenimiento,
      esMantenimiento,
    });
    setAbrirModalGenerico(true);
    setEjecutarFuncionAceptar({ ...ejecutarFuncionAceptar, funcion: ejecutarFuncion });
  };
  const cerrarModalPregunta = () => {
    setAbrirModalPregunta(false);
  };
  const cerrarModalGenerico = () => {
    setAbrirModalGenerico(false);
  };

  return (
    <MensajeContext.Provider
      value={{
        abrirModalPregunta,
        mensajePregunta,
        abrirModalGenerico,
        mensajeGenerico,
        ejecutarFuncionSi,
        ejecutarFuncionAceptar,
        mensajeSistemaPregunta,
        cerrarModalPregunta,
        cerrarModalGenerico,
        mensajeSistemaGenerico,
      }}
    >
      {children}
    </MensajeContext.Provider>
  );
};
