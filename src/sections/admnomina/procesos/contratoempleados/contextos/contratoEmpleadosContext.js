// @KF-14/12/2022
import * as React from 'react';
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import useCargando from '../../../../../hooks/admnomina/useCargando';
import * as postData from '../servicios/postData';
import * as Funciones from '../../../../../utils/admnomina/funciones/funciones';

export const ContratoEmpleadosContext = React.createContext();

// eslint-disable-next-line react/prop-types
export const ContratoEmpleadosProvider = ({ children }) => {
  const { empezarCarga, terminarCarga } = useCargando();
  const { mensajeSistemaGenerico } = useMensajeGeneral();
  const [archivo, setArchivo] = React.useState([]);
  const [listaEmpleados, setListaEmpleados] = React.useState([]);
  const [listacontratos, setListaContratos] = React.useState([]);
  const empleadoRef = React.useRef();
  const fterminacionRef = React.useRef();
  const hfinRef = React.useRef();
  const [empleados, setEmpleados] = React.useState({
    nombre: '',
    codigo: '',
    codigoalternativo: '',
  });
  const dias = [
    {
      id: 1,
      codigo: 1,
      dia: 'Lunes',
    },
    {
      id: 2,
      codigo: 2,
      dia: 'Martes',
    },
    {
      id: 3,
      codigo: 3,
      dia: 'Miercoles',
    },
    {
      id: 4,
      codigo: 4,
      dia: 'Jueves',
    },
    {
      id: 5,
      codigo: 5,
      dia: 'Viernes',
    },
  ];
  const [formulario, setFormulario] = React.useState({
    codcontrato: '',
    observacion: '',
    dinicio: dias[0].codigo,
    dfin: dias[4].codigo,
    hinicio: new Date(),
    hfin: new Date(),
    periododescanso: 1,
    fcontrato: new Date(),
    fingreso: new Date(),
    fterminacion: new Date(),
  });
  const { codigo } = JSON.parse(window.localStorage.getItem('usuario'));
  const usuario = codigo;
  const [maquina, setMaquina] = React.useState();
  Funciones.obtenerMaquina().then((data) => {
    setMaquina(data);
  });
  const SetearEmpleados1 = (e) => {
    setListaEmpleados(e);
    setEmpleados({
      nombre: e[0].nombre,
      codigo: e[0].codigo,
      codigoalternativo: e[0].codigoalternativo,
    });
  };
  const SetearEmpleados2 = (e) => {
    setEmpleados({
      nombre: e.nombre,
      codigo: e.codigo,
      codigoalternativo: e.codigoalternativo,
    });
  };
  const SetearEmpleados3 = (e) => {
    setEmpleados({
      codigoalternativo: e.codigoalternativo,
      nombre: '',
      codigo: '',
    });
  };
  const SetearContatos = (e) => {
    setListaContratos(e);
    setFormulario({
      ...formulario,
      codcontrato: e[0].codigo,
    });
  };
  const SetearContratoFormulario = (e) => {
    setFormulario({
      ...formulario,
      codcontrato: e,
    });
  };
  const SetearDiaInicio = (e) => {
    setFormulario({
      ...formulario,
      dinicio: e,
    });
  };
  const SetearDiaFin = (e) => {
    setFormulario({
      ...formulario,
      dfin: e,
    });
  };
  const SetearHoraInicio = (e) => {
    setFormulario({
      ...formulario,
      hinicio: e,
    });
  };
  const SetearHoraFin = (e) => {
    setFormulario({
      ...formulario,
      hfin: e,
    });
  };
  const SetearFechaContrato = (e) => {
    setFormulario({
      ...formulario,
      fcontrato: e,
    });
  };
  const SetearFechaIngreso = (e) => {
    setFormulario({
      ...formulario,
      fingreso: e,
    });
  };
  const SetearPeriodoDescanso = (e) => {
    setFormulario({
      ...formulario,
      periododescanso: e.floatValue || 0,
    });
  };
  const SetearObservacion = (e) => {
    setFormulario({
      ...formulario,
      observacion: e,
    });
  };
  const SetearFechaTerminacion = (e) => {
    setFormulario({
      ...formulario,
      fterminacion: e,
    });
  };
  const sufijo = () => {
    let sufijo = '';
    if (formulario.periododescanso === 1) {
      sufijo = ' Día';
    } else if (formulario.periododescanso < 1 || formulario.periododescanso >= 2) {
      sufijo = ' Días';
    }
    return sufijo;
  };
  const cargarArchivos = React.useCallback(
    (archivos) => {
      const noEsPdf = archivos.at(0).type !== 'application/pdf';
      if (noEsPdf) {
        mensajeSistemaGenerico({ mensaje: 'Solo puede subir un archivo en formato .pdf' });
        return;
      }
      if (archivo.length >= 1) {
        mensajeSistemaGenerico({ mensaje: 'Solo puede subir un archivo' });
        return;
      }
      if (archivos.at(0).size / 1000000 > 3) {
        mensajeSistemaGenerico({ mensaje: 'Solo puede subir un archivo que pese maximo 3mb' });
        return;
      }
      const nuevosArchivos = archivos.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setArchivo([...archivo, ...nuevosArchivos]);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [archivo]
  );
  const removerArchivo = (archivoRemovido) => {
    const archivosEliminados = archivo.filter((file) => file !== archivoRemovido);
    setArchivo(archivosEliminados);
  };
  const removerTodosLosArchivos = () => setArchivo([]);

  const formularioFinal = {
    TipoContrato: formulario.codcontrato,
    Empleado: empleados.codigo,
    Observacion: formulario.observacion,
    DiaInicioJornada: formulario.dinicio,
    DiaFinJornada: formulario.dfin,
    HoraInicioJornada: formulario.hinicio.toISOString(),
    HoraFinJornada: formulario.hfin.toISOString(),
    PeriodoDescanso: formulario.periododescanso,
    FechaContrato: formulario.fcontrato.toISOString(),
    FechaTerminacion: formulario.fterminacion.toISOString(),
    Fecha_ing: formulario.fingreso.toISOString(),
    Maquina: maquina,
    Usuario: usuario,
  };

  const nuevo = () => {
    setArchivo([]);
    setFormulario({
      codcontrato: '',
      observacion: '',
      dinicio: dias[0].codigo,
      dfin: dias[4].codigo,
      hinicio: new Date(),
      hfin: new Date(),
      periododescanso: 1,
      fcontrato: new Date(),
      fingreso: new Date(),
      fterminacion: new Date(),
    });
    setEmpleados({
      nombre: '',
      codigo: '',
      codigoalternativo: '',
    });
  };

  const validaciones = () => {
    if (empleados.nombre.length === 0) {
      mensajeSistemaGenerico({ mensaje: 'Debe seleccionar un empleado', tipo: 'warning' });
      empleadoRef.current.focus();
      return false;
    }
    if (formulario.fingreso > formulario.fterminacion) {
      mensajeSistemaGenerico({
        mensaje: 'La Fecha de Terminación no debe ser menor a la Fecha de Ingreso',
        tipo: 'warning',
      });
      fterminacionRef.current.focus();
      return false;
    }
    // if (formulario.hinicio > formulario.hfin) {
    //   mensajeSistemaGenerico({
    //     mensaje: 'La Hora Fin no debe ser menor a la Hora de Fin',
    //     tipo: 'warning',
    //   });
    //   hfinRef.current.focus();
    //   return false;
    // }
    if (archivo.length === 0) {
      mensajeSistemaGenerico({ mensaje: 'Debe subir un documento', tipo: 'warning' });
      return false;
    }
    return true;
  };

  const enviarArchivos = () => {
    if (validaciones() === false) {
      return 0;
    }
    empezarCarga();
    try {
      const lecturaArchivo = new FileReader();
      lecturaArchivo.readAsDataURL(archivo.at(0));
      lecturaArchivo.onloadend = (e) => {
        const datos = {
          nombreArchivo: archivo.at(0).name,
          archivo: e.target.result.split('base64,')[1],
        };
        if (postData.GuardarArchivo(datos, formularioFinal) === true) {
          terminarCarga();
          mensajeSistemaGenerico({ mensaje: 'Examen cargado con exito', tipo: 'success' });
          nuevo();
        } else {
          terminarCarga();
          mensajeSistemaGenerico({ mensaje: 'Error al subir el examen', tipo: 'error' });
        }
      };
    } catch (error) {
      mensajeSistemaGenerico({ mensaje: 'Problemas con el servidor contacte con soporte', tipo: 'error' });
      terminarCarga();
    }
  };

  return (
    <ContratoEmpleadosContext.Provider
      value={{
        empleadoRef,
        fterminacionRef,
        usuario,
        sufijo,
        archivo,
        enviarArchivos,
        removerArchivo,
        removerTodosLosArchivos,
        cargarArchivos,
        setListaEmpleados,
        setEmpleados,
        listaEmpleados,
        listacontratos,
        empleados,
        formulario,
        dias,
        SetearEmpleados1,
        SetearEmpleados2,
        SetearEmpleados3,
        SetearContatos,
        SetearContratoFormulario,
        SetearDiaInicio,
        SetearDiaFin,
        SetearHoraInicio,
        SetearHoraFin,
        SetearFechaContrato,
        SetearFechaIngreso,
        SetearFechaTerminacion,
        SetearObservacion,
        SetearPeriodoDescanso,
      }}
    >
      {children}
    </ContratoEmpleadosContext.Provider>
  );
};
