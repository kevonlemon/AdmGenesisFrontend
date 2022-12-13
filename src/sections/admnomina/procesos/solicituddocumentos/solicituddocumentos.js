import * as React from 'react';
import { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Fade,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import es from 'date-fns/locale/es';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import ModalGenerico from '../../../../components/modalgenerico';
import Page from '../../../../components/Page';
import Motivo from './components/motivo';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { formaterarFecha, generarCodigo, obtenerMaquina } from '../../../../utils/sistema/funciones';
import CircularProgreso from '../../../../components/Cargando';
import RequiredTextField from '../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../components/sistema/mensajesgenerico';

export default function SolicitudDocumentos() {
  const user = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const navegacion = useNavigate();
  // Hook para mensajes genéricos
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('succes');
  const [openMensaje, setOpenMensaje] = useState(false);
  const [noSesion, setNoSesion] = useState(false);
  const [noExisteEmpleado, setNoExisteEmpleado] = useState(false);

  const mensajeGenerico = (tipo, msj) => {
    setTexto(msj);
    setTipo(tipo);
    setOpenMensaje(true);
  };

  const cerrarMensaje = () => {
    if (noSesion) {
      setOpenMensaje((p) => !p);
      setNoSesion(false);
      navegacion(`${PATH_AUTH.login}`);
    }
    if (noExisteEmpleado) {
      setOpenMensaje((p) => !p);
      setNoExisteEmpleado(false);
      setOpenModal(true);
      setOpenMensaje((p) => !p);
    }
    setOpenMensaje((p) => !p);
  };

  // MANEJADOR DE ERRORES
  const [errorEmpleado, setErrorEmpleado] = useState(false);
  //   const [errorMonto, setErrorMonto] = useState(false);
  //   const [errorObservacion, setErrorObservacion] = useState(false);

  const [empleado, setEmpleado] = React.useState([]);
  const [numeroSolicitud, SetNumeroSolicitud] = React.useState(0);
  const [formulario, setFormulario] = React.useState({
    fecha: new Date(),
    motivo: '',
    empleado: '',
    codigoempleado: '',
    nombreempleado: '',
    estado: false,
    aprobado: false,
    observacion: '',
  });

  function limpiarCampos() {
    setFormulario({
      ...formulario,
      fecha: new Date(),
      motivo: '',
      empleado: '',
      codigoempleado: '',
      nombreempleado: '',
      estado: true,
      aprobado: false,
      observacion: '',
    });
    setEmpleado([]);
    SetNumeroSolicitud(0);
  }

  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
  const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleShow = () => setOpenModal((p) => !p);
  const handleCallbackChild = (e) => {
    const item = e.row;
    setFormulario({
      ...formulario,
      empleado: item.id,
      codigoempleado: item.codigo,
      nombreempleado: item.nombre,
    });
    toggleShow();
  };

  const validacion = () => {
    const empleado = formulario.codigoempleado;
    const empleadoNom = formulario.nombreempleado;

    if (empleado === '' || empleadoNom === '') {
      setErrorEmpleado(true);
      mensajeGenerico('error', 'Seleccione un empleado');
      return false;
    }
    return true;
  };

  const grabarSolicitudDocumento = async () => {
    if (validacion() === false) {
      return 0;
    }
    try {
      const ip = await obtenerMaquina();
      const form = {
        codigo: 0,
        numero: numeroSolicitud,
        fecha: formulario.fecha,
        motivo: formulario.motivo,
        empleado: formulario.empleado,
        observacion: formulario.observacion,
        estado: true,
        aprobado: false,
        urlDocumento: ' ',
        fechaing: new Date(),
        maquina: ip,
        usuario: user.codigo,
        fechaapr: new Date(),
        maquinaapr: ' ',
        usuarioapr: 0,
      };
      const { data } = await axios.post(`${URLAPIGENERAL}/SolicitudDocumentos`, form, config, setMostrarProgreso(true));
      if (data === 200) {
        mensajeGenerico('succes', 'Datos registrados con éxito');
        limpiarCampos();
      }
      limpiarCampos();
    } catch (error) {
      if (error.response.status === 401) {
        setNoSesion(true);
        mensajeGenerico('error', 'Su sesión expiró');
      } else if (error.response.status === 500) {
        navegacion(`${PATH_PAGE.page500}`);
      } else {
        mensajeGenerico('error', 'Problemas al guardar verifique los datos e inténtelo nuevamente');
      }
    } finally {
      setMostrarProgreso(false);
    }
  };

  React.useEffect(() => {
    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`, config);
        const response = await axios(`${URLAPIGENERAL}/SolicitudDocumentos/listar`, config);

        const listaempleado = data.map((m) => ({ id: m.codigo, codigo: m.codigo_Empleado, nombre: m.nombres }));
        const listadosolicitudocs = response.data;
        const { [Object.keys(listadosolicitudocs).pop()]: lastItem } = listadosolicitudocs;

        SetNumeroSolicitud(lastItem.numero + 1);
        setEmpleado(listaempleado);
      } catch (error) {
        if (error.response.status === 401) {
          setNoSesion(true);
          mensajeGenerico('error', 'Su sesión expiró');
        } else if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        } else {
          mensajeGenerico('error', 'Problemas al obtener datos, inténtelo nuevamente');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    getDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeroSolicitud]);
  //   React.useEffect(() => {
  //     async function getDatosEmpleado() {
  //       try {
  //         const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`, config);
  //         const listaempleado = data.map((m) => ({ id: m.codigo, codigo: m.codigo_Empleado, nombre: m.nombres }));
  //         setEmpleado(listaempleado);
  //         setFormulario({
  //           ...formulario,
  //           empleado: listaempleado[0].id,
  //           codigoempleado: listaempleado[0].codigo,
  //           nombreempleado: listaempleado[0].nombre,
  //         });
  //       } catch (error) {
  //         if (error.response.status === 401) {
  //           setNoSesion(true);
  //           mensajeGenerico('error', 'Su sesión expiró');
  //         } else if (error.response.status === 500) {
  //           navegacion(`${PATH_PAGE.page500}`);
  //         } else {
  //           mensajeGenerico('error', 'Problemas al obtener datos, inténtelo nuevamente');
  //         }
  //       } finally {
  //         setMostrarProgreso(false);
  //       }
  //     }
  //     getDatosEmpleado();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  // -----------------------------------------------------------------------------------------------------
  async function buscarEmpleados() {
    if (formulario.codigoempleado === '') {
      setOpenModal(true);
    } else {
      try {
        const { data } = await axios(
          `${URLAPILOCAL}/empleados/obtenerxcodigo?codigo=${
            formulario.codigoempleado === '' ? 'string' : formulario.codigoempleado
          }`,
          config
        );
        if (data.length === 0) {
          setNoExisteEmpleado(true);
          mensajeGenerico('warning', 'Código no encontrado');
        } else {
          setFormulario({
            ...formulario,
            empleado: data.codigo,
            codigoempleado: data.codigo_Empleado,
            nombreempleado: data.nombres,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // -----------------------------------------------------------------------------------------------------

  return (
    <>
      <MensajesGenericos openModal={openMensaje} closeModal={cerrarMensaje} texto={texto} tipo={tipo} />
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <ModalGenerico
        nombre="Empleados"
        openModal={openModal}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShow}
        rowsData={empleado}
        parentCallback={handleCallbackChild}
      />
      <Page title="Solicitud de Documentos">
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading="Solicitud de Documentos"
              links={[{ name: 'Inicio' }, { name: 'Procesos' }, { name: 'Solicitud de Documentos' }]}
              action={
                <Grid container spacing={1}>
                  <Grid item md={4} sm={4} xs={12} sx={{ mr: 2 }}>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => {
                        limpiarCampos();
                      }}
                      startIcon={<InsertDriveFileRoundedIcon />}
                    >
                      Nuevo
                    </Button>
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => {
                        grabarSolicitudDocumento();
                      }}
                      startIcon={<SaveRoundedIcon />}
                    >
                      Grabar
                    </Button>
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    {/* <Button
                                            // disabled={imprimir}
                                            fullWidth
                                            variant="text"
                                            target="_blank"
                                            // href={`${URLAPILOCAL}/prestamo/generarpdf?codigo=${formulario.codigoimprime}&operador=${usuario.tipo_Persona}`}
                                            startIcon={<PrintRoundedIcon />}
                                        >
                                            Imprimir
                                        </Button> */}
                  </Grid>
                </Grid>
              }
            />
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card sx={{ ml: 3, mr: 3, p: 2 }}>
            <Box>
              <Grid container spacing={1}>
                <Grid item container md={12} spacing={1}>
                  <Grid item md={3} sm={6} xs={12}>
                    <TextField
                      disabled
                      size="small"
                      fullWidth
                      label="Número"
                      value={numeroSolicitud}
                      sx={{
                        backgroundColor: '#e5e8eb',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#212B36',
                      }}
                    />
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <MobileDatePicker
                        label="Fecha"
                        value={formulario.fecha}
                        inputFormat="dd/MM/yyyy"
                        onChange={(newValue) => {
                          setFormulario({
                            ...formulario,
                            fecha: newValue,
                          });
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <Grid item container md={12} spacing={1}>
                  <Grid item md={2} sm={6} xs={12}>
                    <RequiredTextField
                      size="small"
                      fullWidth
                      label="Empleado*"
                      value={formulario.codigoempleado}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          codigoempleado: e.target.value,
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => {
                                buscarEmpleados();
                              }}
                            >
                              <SearchRoundedIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Nombre"
                      value={formulario.nombreempleado}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        backgroundColor: '#e5e8eb',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#212B36',
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item container md={12} spacing={1}>
                  <Grid item md={3} sm={4} xs={12}>
                    <Motivo
                      data={formulario}
                      disparador={(e) => {
                        setFormulario({
                          ...formulario,
                          motivo: e,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item container md={12} spacing={1}>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      multiline
                      rows={4}
                      // maxRows={4}
                      size="normal"
                      fullWidth
                      label="Observación"
                      value={formulario.observacion}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          observacion: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item container md={6} spacing={1} justifyContent="center">
                  <Grid item md={6}>
                    <Button
                      fullWidth
                      variant="text"
                      // onClick={() => { calcularAmortizacion() }}
                      startIcon={<AttachFileRoundedIcon />}
                    >
                      Subir Documento
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Fade>
      </Page>
    </>
  );
}
