import { createContext, useState } from 'react';

export const CargandoContext = createContext();

// eslint-disable-next-line react/prop-types
export const CargandoProvider = ({ children }) => {
  const [cargando, setCargando] = useState(false);
  const empezarCarga = () => setCargando(true);
  const terminarCarga = () => setCargando(false);

  return (
    <CargandoContext.Provider
      value={{
        cargando,
        empezarCarga,
        terminarCarga,
      }}
    >
      {children}
    </CargandoContext.Provider>
  );
};
